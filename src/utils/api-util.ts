import * as fs from 'fs';

import * as crypto from "crypto";
import 'dotenv/config'
import { User } from 'src/entities/user.entity';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, CanActivate, UnauthorizedException } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Observable } from 'rxjs';
import { Audit } from 'src/entities/audit';
import { EventSubscriber, EntitySubscriberInterface, DataSource, InsertEvent, UpdateEvent } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRole } from 'src/enum/user-role.enum';




export function idCrypt(id: number) {
    return `357951456258${id}951753654852`;
}

export function idDecrypt(id: string) {
    if (id.startsWith("357951456258") && id.endsWith("951753654852")) {
        return id.slice(12, - 12);
    }
    return undefined;
}



export function apiWordCrypt(password: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_KEY), iv);

    let encrypted = cipher.update(password, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    const result = iv.toString('hex') + encrypted;

    return result;
}

export function apiJsonCrypt(data: any) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_KEY), iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    const result = iv.toString('hex') + encrypted;

    return result;
}

export function apiWordDecrypt(encryptedData: string) {
    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
    const encryptedText = encryptedData.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.CRYPTO_KEY), iv);

    let decrypted = decipher.update(encryptedText, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
}


export function apiGeneratePayLoad(user: User) {
    return {
        pseudo: "pachimou", sub: apiWordCrypt(JSON.stringify({
            email: user.email, username: user.username ?? undefined, id: user.id,
            role: user.role, status: user.status,
        }))
    };
}

export function apiDecryptPayLoad(data: any) {
    const payload = JSON.parse(apiWordDecrypt(data));
    return payload;
}





@EventSubscriber()
export class UserAuditSubscriber implements EntitySubscriberInterface<Audit> {
    constructor(dataSource: DataSource, private readonly cls: ClsService) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return Audit;
    }

    beforeInsert(event: InsertEvent<Audit>) {
        event.entity.createdBy = this.cls.get('user')?.id;
    }
}

@Injectable()
export class UserAuditInterceptor implements NestInterceptor {
    constructor(private readonly cls: ClsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        this.cls.set('user', user);
        return next.handle();
    }
}


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService,
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        const isPublic = this.reflector.get<boolean>(
            'isPublic',
            context.getHandler()
        );

        if (!token) {
            if (isPublic) {
                return true;
            }
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                {
                    secret: process.env.JWT_SECRET
                }
            );
            request['user'] = apiDecryptPayLoad(payload.sub);
        } catch {
            if (isPublic) {
                return true;
            } else
                throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}


@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean | undefined>('isPublic', [
            context.getHandler(),
            context.getClass()
        ])!;

        if (isPublic == true) {
            return true;
        }

        const requiredRole = this.reflector.getAllAndMerge<UserRole[]>('roles', [
            context.getHandler(),
            context.getClass()
        ]);
        console.log(requiredRole)


        if (!requiredRole || requiredRole.length == 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        const userRole: UserRole = user.role;
        return requiredRole.includes(userRole)
    }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcrypt';
import { ApiError, ApiErrorCreation, ApiErrorDelete, ApiErrorNotFound, ApiErrorTypeOrm, ApiErrorUpdate } from 'src/utils/api-error';
import { User } from 'src/entities/user.entity';
import { LoginDto, UserDto, UserRoleDto, UserUp } from 'src/dto/user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as dateFns from "date-fns";
import { apiDecryptPayLoad, apiGeneratePayLoad, apiJsonCrypt } from 'src/utils/api-util';
import { UserStatus } from 'src/enum/user-role.enum';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private mailerService: MailerService,
        private readonly jwtService: JwtService,

    ) { }

    async register(userDto: UserDto) {
        const data: User = User.create({ ...userDto });
        const user = await this.userRepository.save(data).catch((error: any) => {
            console.log(error);
            if (error.code == "ER_DUP_ENTRY") {
                throw new ApiError("username already exist. Very the given username or login if you already have an account")

            }
            throw new ApiErrorCreation("user")
        });
        await this.sentVerificationLink(user);
        return user;
    }

    async login(body: LoginDto) {
        const user = await this.userRepository.findOne({ where: { username: body.username.trim() } }).catch(error => {
            Logger.error(error);
            throw new ApiError("username or password invalid");
        });

        if (!user) {
            throw new ApiError("username or password invalid");
        }
        const areEqual = await compare(body.password, user.password);
        if (!areEqual) {
            throw new ApiError("Username or password invalid");
        }

        const payload = apiGeneratePayLoad(user);

        const token = this.jwtService.sign(payload);

        const response = { access_token: token, user: user, };

        return response;
    }

    findAll() {
        return this.userRepository.find({ loadEagerRelations: true, order: { createdAt: "DESC" } }).catch(error => {
            Logger.error(error);
            throw new ApiErrorTypeOrm("user");
        });
    }

    async sendFirst() {

        const user = await this.userRepository.findOne({ where: {} }).catch(error => {
            Logger.error(error);
            throw new ApiErrorTypeOrm("user");
        });
        if (!user) {
            throw new ApiErrorNotFound("user");
        }
        console.log(user)
        await this.sentVerificationLink(user);
        return user;

    }

    async findOne(id: number) {
        const user = await this.userRepository.findOne({ where: { id: id } }).catch(error => {
            Logger.error(error);
            throw new ApiErrorTypeOrm("user");
        });
        if (!user) {
            throw new ApiErrorNotFound("user");
        }
        return user;
    }

    async update(id: number, updateUserDto: UserUp) {
        await this.userRepository.update(id, updateUserDto).catch(error => {
            Logger.error(error);
            throw new ApiErrorUpdate("user");
        });
        return await this.findOne(id);
    }

    async updateRole(id: number, userRole: UserRoleDto) {
        await this.userRepository.update(id, { role: userRole.role }).catch(error => {
            Logger.error(error);
            throw new ApiErrorUpdate("user");
        });
        return await this.findOne(id);
    }

    remove(id: number) {
        return this.userRepository.delete(id).catch(error => {
            Logger.error(error);
            throw new ApiErrorDelete("user");
        });
    }


    async sentVerificationLink(user: User): Promise<any> {

        const expired = dateFns.addHours(new Date(), 2);

        const pseudo = { name: user.username, main: user.id, expired: expired, email: user.email };

        const token = `ver_${apiJsonCrypt(pseudo)}`;

        const link = `${process.env.API_ADDRESS}/users/email/verify/${token}`;

        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Library',
            template: 'user-confirmation',
            context: {
                name: user.username,
                link,
            },
        });

        return {
            success: true,
            message: 'Please, check your email to confirm your account ' +
                user.email
        };
    }


    async verifyEmail(token_: string): Promise<any> {
        if (!token_) {
            throw new ApiError("Access token invalid.");
        }

        const token = token_?.replace("ver_", "");
        let payload: any = undefined;

        try {
            payload = apiDecryptPayLoad(token);
        } catch (error) {
            console.log(error);
            throw new ApiError("Access token invalid.");
        }

        const date = new Date(payload.date);
        if (dateFns.isAfter(new Date(), date)) {
            throw new ApiError("Access token expired. Please try again and reset email before two hours");
        }


        const user: User = await this.userRepository.findOne({ where: { id: payload.gerant } }).catch(error => {
            Logger.error(error);
            throw new ApiErrorTypeOrm("User");
        });

        if (!user) {
            throw new ApiError("Access token invalid. Please, try later");
        }


        await this.userRepository.update(user.id, { status: UserStatus.active }).catch(error => {
            console.log(error)
            throw new ApiErrorUpdate("user");
        });

        const payloadData = apiGeneratePayLoad(user);
        const access_key = this.jwtService.sign(payloadData);
        const response = { token: access_key, seniority: "new", user: user };

        return response;
    }

}

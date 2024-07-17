import { Controller, Get, Post, Body, Param, Delete, Put, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { AuthResponse, LoginDto, UserRoleDto, UserUp } from '../dto/user.dto';
import { UserRole } from 'src/enum/user-role.enum';
import { GetUser, Public, Roles } from 'src/utils/api.decorator';
import { UserService } from 'src/services/user.service';
import { error } from 'console';


@ApiTags("users")
@ApiBearerAuth('token')
@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Public()
    @Post("register")
    create(@Body() userDto: UserUp): Promise<User> {
        return this.userService.register(userDto);
    }

    @Public()
    @Post("login")
    login(@Body() body: LoginDto): Promise<AuthResponse> {
        return this.userService.login(body);
    }


    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }


    @Get('me')
    aboutMe(@GetUser() user: User): User {
        return user;
    }

    @ApiExcludeEndpoint(true)
    @Roles(UserRole.admin)
    @Get(':id')
    findOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(+id);
    }


    @ApiExcludeEndpoint(true)
    @Public()
    @Get('email/verify/:code')
    async sendVerification(@Param('code') code: string, @Res() res): Promise<any> {
        let message = undefined;
        const response = await this.userService.verifyEmail(code).catch(error => {
            message = error;
        });
        if (response) {
            return res.redirect("https://atoundji.com");
        } else {
            return res.send(message);
        }

    }




    @Put(':id')
    update(@Param('id') id: number, @Body() body: UserUp): Promise<User> | any {
        return this.userService.update(+id, body);
    }

    @Roles(UserRole.admin)
    @Put(':id/role')
    updateRole(@Param('id') id: number, @Body() body: UserRoleDto): Promise<User> | any {
        return this.userService.updateRole(+id, body);
    }



    @ApiExcludeEndpoint(true)
    @Roles(UserRole.admin)
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.userService.remove(+id);
    }

}

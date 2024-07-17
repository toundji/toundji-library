
import { ApiProperty, OmitType, PartialType, PickType, } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { User } from "src/entities/user.entity";
import { UserRole, UserStatus } from "src/enum/user-role.enum";

export class UserBaseDto {
    @ApiProperty({ required: true })
    @IsString()
    username?: string;

    @ApiProperty({ required: true })
    @IsEmail()
    email?: string;

    @ApiProperty({ required: true })
    @IsString()
    password?: string;

    @ApiProperty()
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;


    @ApiProperty()
    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;

}



export class UserDto extends OmitType(UserBaseDto, ["role", "status"]) {
}


export class UserRoleDto extends PickType(UserBaseDto, ["role"]) {
    @ApiProperty({ required: true })
    @IsEnum(UserRole)
    role?: UserRole;
}


export class LoginDto {

    @ApiProperty({ required: true })
    @IsString()
    username: string;

    @ApiProperty({ required: true })
    @IsString()
    password: string;

}



export class AuthResponse {
    @ApiProperty()
    access_token: string;

    @ApiProperty()
    user: User;
}


export class UserUp extends PartialType(UserDto) {
}


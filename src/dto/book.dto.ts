
import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsDateString, IsString } from "class-validator";
import { UserRole } from "src/enum/user-role.enum";

export class BookDto {

    @ApiProperty({ required: true })
    @IsString()
    title: string;

    @ApiProperty({ required: true })
    @IsString()
    author: string;

    @ApiProperty({ required: true })
    @IsDateString()
    publicationDate: Date;

    @ApiProperty()
    @IsString()
    genres: UserRole;

}

export class BookUp extends PartialType(BookDto) { }


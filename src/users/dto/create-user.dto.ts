import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail,} from "class-validator";


export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    gender: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    pseudo: string;

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password_confirm: string;
/* 
    @ApiProperty()
    @IsString()
    photo: string; */

}
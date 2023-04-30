import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail, IsStrongPassword,} from "class-validator";


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
    @IsStrongPassword({minLength: 8, minLowercase:1, minUppercase: 1, minNumbers: 1, minSymbols: 1})
    password: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password_confirm: string;

}
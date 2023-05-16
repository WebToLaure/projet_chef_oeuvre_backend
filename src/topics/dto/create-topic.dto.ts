import { ApiProperty } from "@nestjs/swagger";
import {IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTopicDto {

    @ApiProperty()
    @IsNumber()
    continentId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    destinations: string;


    @IsString()
    @IsNotEmpty()
    content: string;


}

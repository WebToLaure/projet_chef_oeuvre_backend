import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsNumber, Length, IsInt, IsObject } from "class-validator";
import { Commentary } from "../entities/commentary.entity";
import { Topic } from "src/topics/entities/topic.entity";
import { UpdateDateColumn } from "typeorm";



export class CreateCommentaryDto {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 5000)
    content: string;

    @ApiProperty()
    @IsObject()
    @IsNotEmpty()
    topic: Topic

}

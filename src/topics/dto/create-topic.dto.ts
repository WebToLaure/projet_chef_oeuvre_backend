import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsObject, IsString } from "class-validator";
import { Continent } from "src/continents/entities/continent.entity";

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

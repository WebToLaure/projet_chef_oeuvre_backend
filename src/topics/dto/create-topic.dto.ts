import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateTopicDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    continent_name: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    destinations: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    content: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateContinentDto {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    continent: string;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty,IsNumber, Length, IsInt } from "class-validator";



export class CreateCommentaryDto {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1,5000)
    content: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    create_at: Date;

    @ApiProperty()
    @IsInt()
    topic_id:number

}

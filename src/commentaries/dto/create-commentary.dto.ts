import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty,Length} from "class-validator";


export class CreateCommentaryDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    topicId: string; // sert à récupérer le topic number pour commenter un topic, le topic number arrive en string

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 5000)
    content: string;

}

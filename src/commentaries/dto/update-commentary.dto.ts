import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentaryDto } from './create-commentary.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';



export class UpdateCommentaryDto extends PartialType(CreateCommentaryDto) {


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 5000)
    content: string;


}

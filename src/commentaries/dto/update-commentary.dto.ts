import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentaryDto } from './create-commentary.dto';
import { IsNotEmpty, IsNumber, IsObject, IsString, Length } from 'class-validator';
import { Topic } from 'src/topics/entities/topic.entity';
import { UpdateDateColumn } from 'typeorm';

export class UpdateCommentaryDto extends PartialType(CreateCommentaryDto) {

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    topicId: number

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @Length(1, 5000)
    content: string;
    
}

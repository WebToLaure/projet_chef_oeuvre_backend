import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCommentaryDto } from './create-commentary.dto';
import { IsNotEmpty, IsObject, IsString, Length } from 'class-validator';
import { Topic } from 'src/topics/entities/topic.entity';
import { UpdateDateColumn } from 'typeorm';

export class UpdateCommentaryDto extends PartialType(CreateCommentaryDto) {

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

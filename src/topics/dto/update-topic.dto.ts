import { PartialType,ApiProperty } from '@nestjs/swagger';
import { CreateTopicDto } from './create-topic.dto';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {

    
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
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

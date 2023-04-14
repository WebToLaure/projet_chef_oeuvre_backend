import { PartialType,ApiProperty } from '@nestjs/swagger';
import { CreateTopicDto } from './create-topic.dto';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Continent } from 'src/continents/entities/continent.entity';

export class UpdateTopicDto extends PartialType(CreateTopicDto) {

    
    @ApiProperty()
    @IsObject()
    @IsNotEmpty()
    continent: Continent;

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

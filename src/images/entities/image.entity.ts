import { ApiProperty } from "@nestjs/swagger";
import { Topic } from "src/topics/entities/topic.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('images')
export class Image extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    file: string;

    @ApiProperty({ type: () => Topic })
    @ManyToOne(() => Topic, (topic) => topic.images, { nullable: false, onDelete: 'CASCADE' })
    topic: Topic;


}

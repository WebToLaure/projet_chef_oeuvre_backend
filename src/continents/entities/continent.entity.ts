import { ApiProperty } from "@nestjs/swagger";
import { Topic } from "src/topics/entities/topic.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('continents')
export class Continent extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({
        type: 'varchar',
        nullable: false
    })

    continent: string;

    @ApiProperty({ type: () => Topic })
    @OneToMany(() => Topic, (topic) => topic.continent, { eager: true })
    topics: Topic[]


}

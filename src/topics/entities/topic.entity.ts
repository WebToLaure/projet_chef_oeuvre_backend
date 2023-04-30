import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn, ManyToOne, DeleteDateColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { User } from "src/users/entities/user.entity";
import { Commentary } from "src/commentaries/entities/commentary.entity";
import { Image } from "src/images/entities/image.entity";
import { Continent } from "src/continents/entities/continent.entity";



/* export type Continent = "asie" | "amerique" | "europe" | "oceanie" | "antarctique" | "afrique";

enum EContinent {
    AFRIQUE = 'afrique',
    EUROPE = 'europe',
    ASIE = 'asie',
    AMERIQUE = 'amerique',
    OCEANIE = 'oceanie',
    ANTARCTIQUE = "antarctique"
} */



@Entity('topics')
export class Topic extends BaseEntity {

    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;


    @ApiProperty()
    @Column({
        nullable: false
    })
    title: string;

    @ApiProperty()
    @Column({
        nullable: false
    })
    destinations: string;

    @ApiProperty()
    @Column({
        nullable: false
    })
    content: string;


    @ApiProperty()
    @CreateDateColumn({
        name: "created_at",
        type: "date"
    })
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn({
        name: "updated_at",
        type: "date"
    })
    updatedAt: Date;

    @ApiProperty()
    @DeleteDateColumn({
        name: "deleted_at",
        type: "date"
    })
    deletedAt: Date;


    @ApiProperty({ type: () => Commentary })
    @OneToMany(() => Commentary, (commentary) => commentary.topic, { eager: true })
    commentaries: Commentary[]


    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.topics, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @ApiProperty({ type: () => Image })
    @OneToMany(() => Image, (image) => image.topic, { eager: true })
    images: Image[]

    @ApiProperty({ type: () => Continent })
    @ManyToOne(() => Continent, (continent) => continent.topics, { onDelete: 'CASCADE' })
    continent: Continent;
}











/* @ApiProperty()
    @Column({
        type: 'bytea',
        nullable: false
    })
    attachFile?: Buffer; */ /* ou Uint8Array*/
import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, Timestamp, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { Commentary } from "src/commentaries/entities/commentary.entity";
import { Topic } from "src/topics/entities/topic.entity";



@Entity('users')
export class User extends BaseEntity {


    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({
        nullable: false
    })
    gender: string;


    @ApiProperty()
    @Column({
        length: 50,
        unique: true,
    })
    pseudo: string;

    @ApiProperty()
    @Column({
        unique: true,
    })
    email: string;

    @Exclude()
    @ApiProperty()
    @Column({
        nullable: false,
    })
   
    password: string;


    @ApiProperty()
    @Column({
        nullable: true,
        type: "bytea",
    })
    photo: string;

    @ApiProperty()
    @CreateDateColumn({
       name:"created_at",
       type:"date"
    })
    createdAt: Date;


    @ApiProperty()
    @UpdateDateColumn({
        name:"updated_at",
        type:"date"
    })
    updatedAt: Date;

    @ApiProperty()
    @Column({
        type: 'enum',
        enum: Role,
        default: Role.USER
    })
    @Exclude()
    role: Role;

    @ApiProperty({ type: () => Topic })
    @OneToMany(() => Topic, (topic) => topic.user, { eager: true })
    topics: Topic[]


    @ApiProperty({ type: () => Commentary })
    @OneToMany(() => Commentary, (commentary) => commentary.user, { eager: true })
    commentaries: Commentary[]


}
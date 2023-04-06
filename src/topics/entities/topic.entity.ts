import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToMany, OneToOne, JoinColumn, Timestamp, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/enum/role.enum";
import { User } from "src/users/entities/user.entity";
import { Commentary } from "src/commentaries/entities/commentary.entity";



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

    @ApiProperty(/* { enum: EContinent } */)
    @Column({
       /*  type: 'enum',
        enum: EContinent, //["asie","amerique","europe","oceanie","antarctique","afrique"],
        default: EContinent.EUROPE,
        nullable: false */
    })
    continent: string/* Continent */;

    @ApiProperty()
    @Column({
        nullable: false
    })
    title: string;


    @ApiProperty()
    @Column({
        nullable: false
    })
    visites_pays: string;


    @ApiProperty()
    @Column({
        nullable: false
    })
    content: string;

    /* @ApiProperty()
    @Column({
        type: 'bytea',
        nullable: false
    })
    attachFile?: Buffer; */ /* ou Uint8Array*/

    @ApiProperty()
    @Column({
        type:'timestamp with time zone',
        precision : 3,
        default:()=>"CURRENT_TIMESTAMP"
    })
    createdAt: Date;


    @ApiProperty()
    @Column({
        type:'timestamp with time zone',
        precision : 3,
        default:()=>"CURRENT_TIMESTAMP"
    })
    updatedAt: Date;

    @ApiProperty()
    @Column({
        type:"timestamp with time zone",
        precision : 3,
        default:()=>""
    })
    deletedAt: Date;

    @ApiProperty()
    @Column({
        nullable:true
    })
    likes:number;

    
    @ApiProperty({ type: () => Commentary })
    @OneToMany(() => Commentary, (commentary) => commentary.topic, { eager: true })
    commentaries: Commentary[]


    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.topics, { nullable: false, onDelete: 'CASCADE' })
    user: User;

}

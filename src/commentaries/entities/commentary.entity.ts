import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/users/entities/user.entity";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Topic } from "src/topics/entities/topic.entity";



@Entity('commentaries')
export class Commentary extends BaseEntity {


    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({
        type:'varchar',
        nullable: false
    })

   content: string;

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
        type:'timestamp with time zone',
        precision : 3,
        default:()=>"CURRENT_TIMESTAMP"
    })
    deletedAt: Date;

    @ApiProperty({ type: () => User })
    @ManyToOne(() => User, (user) => user.commentaries, { nullable: false, onDelete: 'CASCADE' })
    user: User;

    @ApiProperty({ type: () => Topic})
    @ManyToOne(() => Topic, (topic) => topic.commentaries, { nullable: false, onDelete: 'CASCADE' })
    topic: Topic;

}

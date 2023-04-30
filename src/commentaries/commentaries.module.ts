import { Module } from '@nestjs/common';
import { CommentariesService } from './commentaries.service';
import { CommentariesController } from './commentaries.controller';
import { TopicsService } from 'src/topics/topics.service';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [CommentariesController],
  providers: [CommentariesService,UsersService, TopicsService]
})
export class CommentariesModule {}

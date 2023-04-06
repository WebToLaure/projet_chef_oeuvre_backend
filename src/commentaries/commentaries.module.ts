import { Module } from '@nestjs/common';
import { CommentariesService } from './commentaries.service';
import { CommentariesController } from './commentaries.controller';
import { TopicsService } from 'src/topics/topics.service';

@Module({
  controllers: [CommentariesController],
  providers: [CommentariesService, TopicsService]
})
export class CommentariesModule {}

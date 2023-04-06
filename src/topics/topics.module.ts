import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService,UsersService]
})
export class TopicsModule {}

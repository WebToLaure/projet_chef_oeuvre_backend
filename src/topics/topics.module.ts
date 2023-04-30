import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsController } from './topics.controller';
import { UsersService } from 'src/users/users.service';
import { ContinentsService } from 'src/continents/continents.service';
import { ImagesService } from 'src/images/images.service';

@Module({
  controllers: [TopicsController],
  providers: [TopicsService,UsersService,ContinentsService, ImagesService]
})
export class TopicsModule {}

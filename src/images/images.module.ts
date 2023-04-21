import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TopicsService } from 'src/topics/topics.service';


@Module({
  /* imports: [
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads',
      }),
    }),
  ], */
  controllers: [ImagesController],
  providers: [ImagesService,TopicsService]
})
export class ImagesModule { }

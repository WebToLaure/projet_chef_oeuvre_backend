import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';

import { CommentariesModule } from './commentaries/commentaries.module';
import { Commentary } from './commentaries/entities/commentary.entity';

import { TopicsModule } from './topics/topics.module';
import { Topic } from './topics/entities/topic.entity';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User,Commentary,Topic],
      synchronize: true,
      logging: false
    }),
    AuthModule,
    UsersModule,
    CommentariesModule,
    TopicsModule,
    
  ],
  controllers: [AppController],
  providers: [AppService],
})export class AppModule { constructor(private datasource: DataSource) { } }

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { RoomController } from './room/room.controller';
import { TodoListController } from './todo-list/todo-list.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { TodoListModule } from './todo-list/todo-list.module';
import { SocialloginModule } from './sociallogin/sociallogin.module';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { RoomModule } from './room/room.module';
import { ChatsModule } from './chats/chats.module';
import { MessageModule } from './message/message.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TimesModule } from './times/times.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MongooseModule.forRoot(
      // 'mongodb+srv://test:sparta@cluster0.ylhhbdq.mongodb.net/?retryWrites=true&w=majority',
      'mongodb+srv://test:sparta@cluster0.yjvro.mongodb.net/Stupy?retryWrites=true&w=majority',

      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    UsersModule,
    SocialloginModule,
    TodoListModule,
    RoomModule,
    MulterModule.register({
      dest: './public',
    }),
    ChatsModule,
    MessageModule,
    TimesModule,
    AuthModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}

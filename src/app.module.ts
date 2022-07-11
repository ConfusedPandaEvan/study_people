import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { RoomController } from './room/room.controller';
import { TodoListController } from './todo-list/todo-list.controller'; 
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { TodoListModule } from './todo-list/todo-list.module';
import { SocialloginModule } from './sociallogin/sociallogin.module';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      // 'mongodb+srv://test:sparta@cluster0.ylhhbdq.mongodb.net/?retryWrites=true&w=majority',
      'mongodb+srv://test:sparta@cluster0.yjvro.mongodb.net/?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    ),
    UserModule,
    SocialloginModule,
    TodoListModule,
    RoomModule,
    MulterModule.register({
      dest: './public',
    }),
  ],

  controllers: [AppController],
  providers: [AppService,UserService],
})
export class AppModule {}
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { TodoListSchema } from './todo-list.model';
import { TodoSchema } from './todo.model';
import { UserSchema } from 'src/users/user.Schema';
import { Authmiddleware } from 'src/middlewares/auth.middleware';
import { SocialloginService } from 'src/sociallogin/sociallogin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TodoList', schema: TodoListSchema }]),
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [TodoListController],
  providers: [TodoListService, SocialloginService],
  exports: [TodoListService],
})
export class TodoListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authmiddleware).forRoutes(TodoListController);
  }
}

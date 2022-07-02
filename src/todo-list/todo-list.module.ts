import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoListController } from './todo-list.controller';
import { TodoListService } from './todo-list.service';
import { TodoListSchema } from './todo-list.model';
import { TodoSchema } from './todo.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'TodoList', schema: TodoListSchema }]),
    MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }]),
  ],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}

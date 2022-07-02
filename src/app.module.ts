import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoListModule } from './todo-list/todo-list.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://test:sparta@cluster0.yjvro.mongodb.net/study_people?retryWrites=true&w=majority',
    ),
    TodoListModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

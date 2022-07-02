import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { TodoListService } from './todo-list.service';

@Controller('todolist')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  //make it possible to access with userId
  //get todos as well
  @Get()
  async getAllTodoLists() {
    const todoLists = await this.todoListService.getAllTodoLists();
    return todoLists;
  }

  //merge with getAllTodoLists and delete this
  @Get('/todos')
  async getAllTodo() {
    const todos = await this.todoListService.getAllTodo();
    return todos;
  }

  //Create a Todo List
  @Post()
  async createTodoList(@Body() createTodoListDto: CreateTodoListDto) {
    const generatedId = await this.todoListService.createTodoList(
      createTodoListDto,
    );
    return { id: generatedId };
  }

  //Delete Todo-List and corresponding Todos
  @Delete('/:TodoListId')
  async deleteTodoList(@Param('TodoListId') todoListId: string) {
    await this.todoListService.deleteTodoList(todoListId);
    return null;
  }

  //Change Todo-List Title
  @Patch('/:TodoListId')
  async updateTodoList(
    @Param('TodoListId') todoListId: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    await this.todoListService.updateTodoList(todoListId, updateTodoListDto);
    return null;
  }

  //Create Todo
  @Post('/:TodoListId')
  async createTodo(
    @Param('TodoListId') todoListId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    const generatedId = await this.todoListService.createTodo(
      todoListId,
      createTodoDto,
    );
    return generatedId;
  }

  //Delete Todo
  @Delete('/todo/:TodoId')
  async deleteTodo(@Param('TodoId') todoId: string) {
    await this.todoListService.deleteTodoList(todoId);
    return null;
  }

  //Change Todo Content
  @Patch('/todo/:TodoId')
  async updateTodo(
    @Param('TodoId') todoId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    await this.todoListService.updateTodo(todoId, createTodoDto);
    return null;
  }

  //Change Todo Status
  @Get('/todo/:TodoId')
  async statusTodo(@Param('TodoId') todoId: string) {
    await this.todoListService.statusTodo(todoId);
    return null;
  }
}

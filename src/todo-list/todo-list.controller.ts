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
  @Get('/todos/:TodoListId')
  async getAllTodo(@Param('TodoListId') todoListId: string) {
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Put Res.locals
  //Create a default Todo List and return the whole todolist
  @Post()
  async createTodoList() {
    await this.todoListService.createTodoList();
    const todolists = await this.todoListService.getAllTodoLists();
    return todolists;
  }

  //Delete Todo-List and corresponding Todos
  @Delete('/:TodoListId')
  async deleteTodoList(@Param('TodoListId') todoListId: string) {
    await this.todoListService.deleteTodoList(todoListId);
    const todolists = this.getAllTodoLists();
    return todolists;
  }

  //Change Todo-List Title
  @Patch('/:TodoListId')
  async updateTodoList(
    @Param('TodoListId') todoListId: string,
    @Body() updateTodoListDto: UpdateTodoListDto,
  ) {
    await this.todoListService.updateTodoList(todoListId, updateTodoListDto);
    const todolists = this.getAllTodoLists();
    return todolists;
  }

  //Create Todo
  @Post('/:TodoListId')
  async createTodo(@Param('TodoListId') todoListId: string) {
    await this.todoListService.createTodo(todoListId);
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Delete Todo
  @Delete('/:TodoListId/:TodoId')
  async deleteTodo(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
  ) {
    await this.todoListService.deleteTodo(todoListId, todoId);
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Change Todo Content
  @Patch('/:TodoListId/:TodoId')
  async updateTodo(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    await this.todoListService.updateTodo(todoListId, todoId, createTodoDto);
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Change Todo Status
  @Get('/:TodoListId/:TodoId')
  async statusTodo(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
  ) {
    await this.todoListService.statusTodo(todoListId, todoId);
    return null;
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { DeleteTodoListDto } from './dto/delete-todolist.dto';
import { TodoListService } from './todo-list.service';
import { ControllerAuthGuard } from 'src/auth/controllerauth.guard';
import { RequestWithAuth } from 'src/types';

@Controller('todolist')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  //get todos as well
  @UseGuards(ControllerAuthGuard)
  @Get()
  async getAllTodoLists(@Req() request: RequestWithAuth) {
    const { userId } = request;
    const todoLists = await this.todoListService.getAllTodoLists(userId);
    return todoLists;
  }

  //merge with getAllTodoLists and delete this
  @UseGuards(ControllerAuthGuard)
  @Get('/todos/:TodoListId')
  async getAllTodo(@Param('TodoListId') todoListId: string) {
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Create a default Todo List and return the whole todolist
  @UseGuards(ControllerAuthGuard)
  @Post()
  async createTodoList(@Req() request: RequestWithAuth) {
    const { userId } = request;
    await this.todoListService.createTodoList(userId);
    const todolists = await this.todoListService.getAllTodoLists(userId);
    return todolists;
  }

  //Change Todo Status
  @UseGuards(ControllerAuthGuard)
  @Post('/status_to_false/:TodoListId/:TodoId')
  async statusTodo2False(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
  ) {
    await this.todoListService.statusTodo2False(todoListId, todoId);
    return null;
  }

  @UseGuards(ControllerAuthGuard)
  @Post('/status_to_true/:TodoListId/:TodoId')
  async statusTodo2True(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
  ) {
    await this.todoListService.statusTodo2True(todoListId, todoId);
    return null;
  }

  //Delete Todo-List and corresponding Todos
  @UseGuards(ControllerAuthGuard)
  @Delete('/:TodoListId')
  async deleteTodoList(
    @Param('TodoListId') todoListId: string,
    @Req() request: RequestWithAuth,
  ) {
    await this.todoListService.deleteTodoList(todoListId);
    const todolists = this.getAllTodoLists(request);
    return todolists;
  }

  //Create Todo
  @UseGuards(ControllerAuthGuard)
  @Post('/:TodoListId')
  async createTodo(@Param('TodoListId') todoListId: string) {
    await this.todoListService.createTodo(todoListId);
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Delete Todo
  @UseGuards(ControllerAuthGuard)
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
  @UseGuards(ControllerAuthGuard)
  @Patch('/:TodoListId')
  async updateTodo(
    @Param('TodoListId') todoListId: string,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    await this.todoListService.updateTodo(todoListId, createTodoDto);
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }
}

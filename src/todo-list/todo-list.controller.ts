import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/middlewares/get-user.decorator';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { DeleteTodoListDto } from './dto/delete-todolist.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';
import { TodoListService } from './todo-list.service';

@Controller('todolist')
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  //make it possible to access with userId
  //get todos as well
  @Get()
  async getAllTodoLists(@GetUser() userId: string) {
    const todoLists = await this.todoListService.getAllTodoLists(userId);
    return todoLists;
  }

  //merge with getAllTodoLists and delete this
  @Get('/todos/:TodoListId')
  async getAllTodo(@Param('TodoListId') todoListId: string) {
    const todos = await this.todoListService.getAllTodo(todoListId);
    return todos;
  }

  //Create a default Todo List and return the whole todolist
  @Post()
  async createTodoList(@GetUser() userId: string) {
    await this.todoListService.createTodoList(userId);
    const todolists = await this.todoListService.getAllTodoLists(userId);
    return todolists;
  }

  //Change Todo Status
  @Post('/status_to_false/:TodoListId/:TodoId')
  async statusTodo2False(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
  ) {
    await this.todoListService.statusTodo2False(todoListId, todoId);
    return null;
  }

  @Post('/status_to_true/:TodoListId/:TodoId')
  async statusTodo2True(
    @Param('TodoListId') todoListId: string,
    @Param('TodoId') todoId: string,
  ) {
    await this.todoListService.statusTodo2True(todoListId, todoId);
    return null;
  }

  //Delete Todo-List and corresponding Todos
  @Delete('')
  async deleteTodoList(
    @Body() deleteTodoListDto: DeleteTodoListDto,
    @GetUser() userId: string,
  ) {
    await this.todoListService.deleteTodoList(deleteTodoListDto);
    const todolists = this.getAllTodoLists(userId);
    return todolists;
  }

  //Change Todo-List Title
  // @Patch('/:TodoListId')
  // async updateTodoList(
  //   @Param('TodoListId') todoListId: string,
  //   @Body() updateTodoListDto: UpdateTodoListDto,
  //   @GetUser() userId: string,
  // ) {
  //   await this.todoListService.updateTodoList(todoListId, updateTodoListDto);
  //   const todolists = this.getAllTodoLists(userId);
  //   return todolists;
  // }

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

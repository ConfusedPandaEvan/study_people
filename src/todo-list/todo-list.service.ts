import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTodoListDto } from './dto/create-todo-list.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoListDto } from './dto/update-todo-list.dto';

import { TodoList } from './todo-list.model';
import { Todo } from './todo.model';

@Injectable()
export class TodoListService {
  constructor(
    @InjectModel('TodoList') private readonly todoListModel: Model<TodoList>,
    @InjectModel('Todo') private readonly todoModel: Model<Todo>,
  ) {}

  async getAllTodoLists() {
    const todoLists = await this.todoListModel.find().exec();
    //add getting todos
    return todoLists.map((todoL) => ({
      todoListId: todoL.id,
      title: todoL.title,
      userId: todoL.userId,
    }));
  }

  //remove this and merge with getAllTodoLists
  async getAllTodo() {
    const todos = await this.todoModel.find().exec();
    return todos.map((todoL) => ({
      todoId: todoL.id,
      content: todoL.content,
      todoListId: todoL.todoListId,
      createdAt: todoL.createdAt,
      status: todoL.status,
    }));
  }

  async createTodoList(createTodoListDto: CreateTodoListDto) {
    const newTodoList = new this.todoListModel({
      ...createTodoListDto,
    });
    const result = await newTodoList.save();
    return result.id as string;
  }

  async deleteTodoList(todoListId: string) {
    await this.todoListModel.deleteOne({ _id: todoListId }).exec();
    await this.todoModel.deleteMany({ todoListId: todoListId }).exec();
    return null;
  }

  async updateTodoList(todoListId, updateTodoListDto: UpdateTodoListDto) {
    const updated = await this.findTodoList(todoListId);
    if (updateTodoListDto.title) {
      updated.title = updateTodoListDto.title;
    }
    updated.save();
  }

  async createTodo(todoListId, createTodoDto: CreateTodoDto) {
    const newTodo = new this.todoModel({
      ...createTodoDto,
      todoListId,
      status: false,
      createdAt: new Date(),
    });
    const result = await newTodo.save();
    return result.id as string;
  }

  async deleteTodo(todoId) {
    await this.todoModel.deleteOne({ _id: todoId }).exec();
    return null;
  }

  async updateTodo(todoId, createTodoDto: CreateTodoDto) {
    const updated = await this.findTodo(todoId);
    if (createTodoDto.content) {
      updated.content = createTodoDto.content;
    }
    updated.save();
  }

  async statusTodo(todoId) {
    const updated = await this.findTodo(todoId);
    updated.status = !updated.status;
    updated.save();
  }

  private async findTodoList(id: string): Promise<TodoList> {
    let todolist;
    try {
      todolist = await this.todoListModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find TodoList');
    }
    if (!todolist) {
      throw new NotFoundException('Could not find TodoList');
    }
    return todolist;
  }

  private async findTodo(id: string): Promise<Todo> {
    let todo;
    try {
      todo = await this.todoModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could not find Todo');
    }
    if (!todo) {
      throw new NotFoundException('Could not find Todo');
    }
    return todo;
  }
}

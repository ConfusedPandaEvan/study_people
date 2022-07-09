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
      todos: todoL.todos,
    }));
  }

  //remove this and merge with getAllTodoLists
  async getAllTodo() {
    const todos = await this.todoModel.find().exec();
    return todos.map((todoL) => ({
      todoId: todoL.id,
      content: todoL.content,
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
      status: false,
      createdAt: new Date(),
    });

    await this.todoListModel.updateOne(
      { _id: todoListId },
      { $push: { todos: newTodo } },
    );

    //return todoList's id in a JSON format
    return JSON.parse(`{ "id": "${todoListId}" }`);
  }

  async deleteTodo(todoListId, todoId) {
    await this.todoListModel.updateOne(
      { _id: todoListId },
      { $pull: { todos: { _id: todoId } } },
    );

    return null;
  }

  async updateTodo(todoListId, todoId, createTodoDto: CreateTodoDto) {
    if (createTodoDto.content) {
      await this.todoListModel.updateOne(
        { _id: todoListId },
        { $set: { 'todos.$[elem].content': createTodoDto.content } },
        { arrayFilters: [{ $and: [{ 'elem._id': todoId }] }] },
      );
    }

    return null;
  }

  //Need to fix toggle status part
  async statusTodo(todoListId, todoId) {
    // const status = await this.todoListModel
    //   .find({ _id: todoListId }, { todos: { $elemMatch: { _id: todoId } } })
    //   .exec();

    await this.todoListModel.updateOne(
      { _id: todoListId },
      { $set: { 'todos.$[elem].status': false } },
      { arrayFilters: [{ $and: [{ 'elem._id': todoId }] }] },
    );

    return null;
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

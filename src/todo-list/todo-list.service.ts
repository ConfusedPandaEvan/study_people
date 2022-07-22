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

  //Add getting todolist by userId
  async getAllTodoLists(userId) {
    let todoLists = await this.todoListModel.find({ userId: userId }).exec();

    if (todoLists.length == 0) {
      await this.createTodoList(userId);
      todoLists = await this.todoListModel.find({ userId: userId }).exec();
    }

    //add getting todos
    return todoLists.map((todoL) => ({
      todoListId: todoL.id,
      title: todoL.title,
      userId: todoL.userId,
      todos: todoL.todos,
    }));
  }

  //Get all Todos of a TodoList
  async getAllTodo(todoListId) {
    const todos = await this.todoListModel.find({ _id: todoListId }).exec();
    return todos.map((todoL) => ({
      todos: todoL.todos,
    }));
  }

  //Create Default TodoList with one Default Todo
  async createTodoList(userId) {
    const newTodoList = new this.todoListModel({
      userId,
      title: 'default To-do List',
    });
    const result = await newTodoList.save();

    await this.createTodo(result.id);

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
    await updated.save();
  }

  async createTodo(todoListId) {
    const newTodo = new this.todoModel({
      content: 'default To-do',
      status: false,
      createdAt: new Date(),
    });

    await this.todoListModel.updateOne(
      { _id: todoListId },
      { $push: { todos: newTodo } },
    );

    //return todoList's id in a JSON format
    // return JSON.parse(`{ "id": "${todoListId}" }`);
    return todoListId;
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
  async statusTodo2False(todoListId, todoId) {
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
  async statusTodo2True(todoListId, todoId) {
    // const status = await this.todoListModel
    //   .find({ _id: todoListId }, { todos: { $elemMatch: { _id: todoId } } })
    //   .exec();

    await this.todoListModel.updateOne(
      { _id: todoListId },
      { $set: { 'todos.$[elem].status': true } },
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

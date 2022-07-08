import * as mongoose from 'mongoose';
import { Todo, TodoSchema } from './todo.model';

export const TodoListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  todos: { type: [TodoSchema], default: undefined },
});

export interface TodoList extends mongoose.Document {
  id: string;
  userId: string;
  title: string;
  todos: [Todo];
}

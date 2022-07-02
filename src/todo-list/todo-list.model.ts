import * as mongoose from 'mongoose';

export const TodoListSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
});

export interface TodoList extends mongoose.Document {
  id: string;
  userId: string;
  title: string;
}

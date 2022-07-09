import * as mongoose from 'mongoose';

export const TodoSchema = new mongoose.Schema({
  content: { type: String, required: true },
  status: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
});

export interface Todo extends mongoose.Document {
  id: string;
  content: string;
  status: boolean;
  createdAt: Date;
}

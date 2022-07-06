import mongoose from 'mongoose';

export const HashtagSchema = new mongoose.Schema({
  content: { type: String, required: true },
  rooms: { type: [String], required: true },
});

export interface Hashtag extends mongoose.Document {
  id: string;
  content: string;
  rooms: [string];
}

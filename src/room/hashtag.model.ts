import mongoose from 'mongoose';

export const HashtagSchema = new mongoose.Schema({
  content: { type: String },
  rooms: { type: [String] },
});

export interface Hashtag extends mongoose.Document {
  id: string;
  content: string;
  rooms: [string];
}

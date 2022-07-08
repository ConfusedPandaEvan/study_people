import * as mongoose from 'mongoose';
import { User, UserSchema } from 'src/schemas/user.Schema';

export const RoomSchema = new mongoose.Schema({
  users: { type: [String], default: undefined, required: true },
  title: { type: String,},
  content: { type: String,},
  password: { type: String,},
  //change hashtag to hashtag schema
  hashtags: { type: [String], default: undefined },
  openKakao: { type: String, },
  maxPeople: { type: Number, },
  imageLocation: { type: String,  },
  createdAt: { type: Date, },
  lastVisited: { type: Date, },
});

export interface Room extends mongoose.Document {
  id: string;
  users: [string];
  title: string;
  content: string;
  password: string;
  hashtags: [string];
  openKakao: string;
  maxPeople: number;
  imageLocation: string;
  createdAt: Date;
  lastVisited: Date;
}

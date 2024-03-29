import * as mongoose from 'mongoose';
import { User, UserSchema } from 'src/users/user.Schema';

export const RoomSchema = new mongoose.Schema({
  users: { type: [String], default: undefined, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  password: { type: String, required: true },
  //change hashtag to hashtag schema
  hashtags: { type: [String], default: undefined },
  openKakao: { type: String, required: true },
  maxPeople: { type: Number, required: true },
  usersNum: { type: Number, required: true },
  imageLocation: { type: String },
  blackList: { type: [String], default: undefined },
  createdAt: { type: Date, required: true },
  lastVisited: { type: Date, required: true },
  liveStatus: { type: Boolean, required: true, default: false },
  totalStudyTime: { type: Number, default: 0 },
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
  usersNum: number;
  imageLocation: string;
  blackList: Array<string>;
  createdAt: Date;
  lastVisited: Date;
  liveStatus: boolean;
  totalStudyTime: number;
}

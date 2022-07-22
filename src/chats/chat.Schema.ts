import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'
import { User } from 'src/users/user.Schema';
export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop()
  roomId: string;

  @Prop()
  content: string;

  @Prop({type: mongoose.Schema.Types.ObjectId,ref: 'User'})
  userId: User;

  @Prop()
  createdAt: Date;
}


export const ChatSchema = SchemaFactory.createForClass(Chat);


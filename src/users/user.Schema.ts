import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  kakaouserId: string;

  @Prop()
  naverId: string

  @Prop()
  userNick: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  profileImage: string;

  @Prop({ type: Number, default: 0, })
  joinedRoomNum: number
}

export const UserSchema = SchemaFactory.createForClass(User);

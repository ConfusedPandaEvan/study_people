import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  kakaouserId: string;

  @Prop()
  userNick: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  profileImage: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

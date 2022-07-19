import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Time & Document;

@Schema()
export class Time {
  @Prop()
  roomId: string;

  @Prop()
  userId: string;

  @Prop()
  studytime: number;
}


export const TimeSchema = SchemaFactory.createForClass(Time);


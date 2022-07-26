import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Time & Document;

//roomId, userId, studytime 셋다 모두 필수조건으로 바꿔보기
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


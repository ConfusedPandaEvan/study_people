import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from 'src/chats/chat.Schema';
import { UserSchema } from 'src/users/user.Schema';
import { RoomSchema } from 'src/room/room.model';
import { TimeSchema } from 'src/times/time.Schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Time', schema: TimeSchema }])
  ],
  providers: [MessageGateway, MessageService]
})
export class MessageModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashtagSchema } from './hashtag.model';
import { RoomController } from './room.controller';
import { RoomSchema } from './room.model';
import { RoomService } from './room.service';
import { UserSchema } from 'src/users/user.Schema';
import { SocialloginService } from 'src/sociallogin/sociallogin.service';
import { RoomSearchService } from './roomSearch.service';
import { ChatSchema } from 'src/chats/chat.Schema';
import { TimeSchema } from 'src/times/time.Schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Hashtag', schema: HashtagSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    MongooseModule.forFeature([{ name: 'Time', schema: TimeSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService, SocialloginService, RoomSearchService],
  exports: [RoomService],
})
export class RoomModule {}

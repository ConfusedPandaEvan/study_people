import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashtagSchema } from './hashtag.model';
import { RoomController } from './room.controller';
import { RoomSchema } from './room.model';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Hashtag', schema: HashtagSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HashtagSchema } from './hashtag.model';
import { RoomController } from './room.controller';
import { RoomSchema } from './room.model';
import { RoomService } from './room.service';
import { UserSchema } from 'src/schemas/user.Schema';
import { Authmiddleware } from 'src/middlewares/auth.middleware';
import { SocialloginService } from 'src/sociallogin/sociallogin.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    MongooseModule.forFeature([{ name: 'Hashtag', schema: HashtagSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService, SocialloginService],
})
export class RoomModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(Authmiddleware).forRoutes(RoomController);
  }
}

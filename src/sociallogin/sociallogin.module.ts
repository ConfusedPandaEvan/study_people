import { Module } from '@nestjs/common';
import { SocialloginController } from './sociallogin.controller';
import { SocialloginService } from './sociallogin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schemas/user.Schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [SocialloginController],
  providers: [SocialloginService]
})
export class SocialloginModule {}

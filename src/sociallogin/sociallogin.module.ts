import { Module } from '@nestjs/common';
import { SocialloginController } from './sociallogin.controller';
import { SocialloginService } from './sociallogin.service';

@Module({
  controllers: [SocialloginController],
  providers: [SocialloginService]
})
export class SocialloginModule {}

import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { SocialloginService } from './sociallogin.service';

@Controller('')
export class SocialloginController {
  constructor(private readonly SocialloginService: SocialloginService) {}

  @Get('main')
  @Redirect('http://stupy.co.kr/kakao/login', 301)
  // @Redirect('http://localhost:3000/kakao/login', 301)
  async kakaoLoginMain(@Query() query: string) {
    const { token } = await this.SocialloginService.kakaoLoginMain(query);
    //나중에 다시 바꿔야함
    // return { url: `http://stupy.co.kr/kakao/login?token=${token}` };
    return { url: `http://localhost:3000/kakao/login?token=${token}` };
  }
}

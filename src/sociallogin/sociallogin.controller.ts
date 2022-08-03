import { Body, Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { query } from 'express';
import { SocialloginService } from './sociallogin.service';

@Controller('')
export class SocialloginController {
  constructor(private readonly SocialloginService: SocialloginService) {}

  @Get('main')
  @Redirect('http://stupy.co.kr/kakao/login', 301)
  // @Redirect('http://localhost:3000/kakao/login', 301)
  async kakaoLoginMain(@Query() query: string) {
    const { token, newuser } = await this.SocialloginService.kakaoLoginMain(
      query,
    );
    // return {
    //   url: `http://stupy.co.kr/kakao/login?token=${token}&newuser=${newuser}`,
    // };
    return {
      url: `http://localhost:3000/kakao/login?token=${token}&newuser=${newuser}`,
    };
  }
  @Get('naverlogin')
  @Redirect('http://stupy.co.kr/kakao/login', 301)
  async naverLogin(@Query() query) {
    const { token, newuser } = await this.SocialloginService.naverLogin(query);
    return {
      url: `http://stupy.co.kr/kakao/login?token=${token}&newuser=${newuser}`,
    };
  }
}

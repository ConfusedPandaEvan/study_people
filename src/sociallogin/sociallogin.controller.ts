import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { SocialloginService } from './sociallogin.service';

@Controller('')
export class SocialloginController {
    constructor(private readonly SocialloginService: SocialloginService) {}

    @Get('kakaoLogin')
    kakaoLogin(@Res() res: any) {
        // console.log('kakaoLogin Controller');
        return this.SocialloginService.kakaoLogin();
    }

    @Redirect('http://localhost:3000/', 301)
    // @Redirect('http://stupy.co.kr/', 301)
    @Get('main')
    kakaoLoginMain(@Query() query: string) {
        // const { code } = paginationQuery;
        // console.log('controller code :', code);
        return this.SocialloginService.kakaoLoginMain(query);

    }

}

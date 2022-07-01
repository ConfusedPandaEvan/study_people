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

    
    // @Redirect('http://stupy.co.kr/', 301)
    
    @Get('main')
    @Redirect('http://stupy.co.kr/', 301)
    async kakaoLoginMain(@Query() query: string) {
        // const { code } = paginationQuery;
        // console.log('controller code :', code);
        const { token } = await this.SocialloginService.kakaoLoginMain(query)
        return {url: `http://stupy.co.kr/${token}`};
    }

//     공식문서 참고 
//     @Get('redirect/focs')
//     @Redirect('https://docs.nestjs.com', 302)
//     getDocs(@Query('version') version) {
//         version = '5'
//     return { url: `https://docs.nestjs.com/v${version}/` };
//   }
}

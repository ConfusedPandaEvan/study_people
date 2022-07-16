import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/.well-known/pki-validation/724F5E422FBC3D01831016D700674821.txt')
  wellknown(@Res() res: any) {
    res.sendFile(
      __dirname +
        '/.well-known/pki-validation/724F5E422FBC3D01831016D700674821.txt',
    );
  }
}

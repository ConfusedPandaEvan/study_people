import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'connection test123,check middleware, checkImageFileStatus';
  }
}

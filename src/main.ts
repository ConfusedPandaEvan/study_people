import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./private.key'),
  //   cert: fs.readFileSync('./private.crt')

  // }
  // const app = await NestFactory.create(AppModule,{httpsOptions});
  const app = await NestFactory.create(AppModule)
  app.enableCors();
//   app.enableCors({
//     origin:"http://stupy.co.kr",
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
// });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

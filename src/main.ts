import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as https from 'https';
import * as http from 'http';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //   app.enableCors({
  //     origin:"http://stupy.co.kr",
  //     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //     credentials: true,
  // });

  const server = express();

  app.useGlobalPipes(new ValidationPipe());
  await app.init();

  // http.createServer(server).listen(3000);
  await https.createServer(server).listen(443);
}
bootstrap();

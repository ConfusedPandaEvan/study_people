import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/users/user.Schema';
import { Model } from 'mongoose';
import { NextFunction, Request, Response } from 'express';


import * as jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

@Injectable()
export class Authmiddleware implements NestMiddleware {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
  use(req: Request, res: Response, next: NextFunction) {
    console.log('middleware passed');
    const { authorization } = req.headers;
    console.log(authorization);
    if (!authorization) {
      console.log('로그인 후 이용하세요!(헤더없음)')
      throw new UnauthorizedException('로그인 후 이용하세요!(헤더없음)')
    }
    const [tokenType, tokenValue] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      console.log('로그인 후 이용하세요!(타입에러)')
      throw new UnauthorizedException('로그인 후 이용하세요!(타입에러)')
      ;
    }
    try {
      const token = jwt.verify(tokenValue, 'MyKey') as JwtPayload;
      console.log('valid token: ', token);
      } catch (err) {
        console.log('로그인 후 이용하세요!(토큰검증에러)')
      throw new UnauthorizedException('로그인 후 이용하세요!(토큰검증에러)')
    }
    next();
  }
}

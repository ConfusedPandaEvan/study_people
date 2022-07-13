import {
  Module,
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/users/user.Schema';
import { Model } from 'mongoose';
import { UserSchema } from 'src/users/user.Schema';
import { SocialloginService } from 'src/sociallogin/sociallogin.service';
import { NextFunction, Request, Response } from 'express';
import { MongooseModule } from '@nestjs/mongoose';

import * as jwt from 'jsonwebtoken';
import { UsersModule } from 'src/users/users.module';
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
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '로그인 후 이용하세요!(헤더없음)',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const [tokenType, tokenValue] = authorization.split(' ');
    if (tokenType !== 'Bearer') {
      console.log('error1');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '로그인 후 이용하세요!(타입에러)',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Mykey Value needs to be changed
      // const userid = jwt.verify(tokenValue, 'MyKey');
      // const loginUser = await SocialloginService.findUser({ _id:userid });
      // res.locals.user = user
      // next();
      console.log('error2');
      const token = jwt.verify(tokenValue, 'MyKey') as JwtPayload;
      console.log('valid token: ', token);
      this.userModel.findOne({ _id: token.userId }).then((user) => {
        res.locals.user = user;
        console.log(res.locals);
        console.log('after next');
      });
    } catch (err) {
      console.log('error3');
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          errorMessage: '로그인 후 이용하세요!(토큰검증에러)',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}

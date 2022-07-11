import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from 'src/schemas/user.Schema';
import { Model } from 'mongoose';
import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
interface JwtPayload {
    userId: string;
  }

@Injectable()
export class Authmiddleware implements NestMiddleware {
    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    use(req: Request, res: Response, next: NextFunction){
        console.log('middleware passed');
        const { authorization } = req.headers;
        const [tokenType, tokenValue] = authorization.split(' ');
        if (tokenType !== 'Bearer') {
            throw new HttpException(
              {
                status: HttpStatus.BAD_REQUEST,
                errorMessage: '로그인 후 이용하세요!',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        try {
            //Mykey Value needs to be changed
            // const userid = jwt.verify(tokenValue, 'MyKey');
            // const loginUser = await this.userModel.findOne({ _id:userid });
            // res.locals.user = user
            // next();
            const token = jwt.verify(tokenValue, 'MyKey') as JwtPayload;
            this.userModel.findOne({ _id:token.userId }).then((user) => {
            res.locals.user = user;
            next();
            })

            } catch (error) {
                throw new HttpException(
                  {
                    status: HttpStatus.BAD_REQUEST,
                    errorMessage: '로그인 후 이용하세요!',
                  },
                  HttpStatus.BAD_REQUEST,
                );
              }
        
        next()
    }
}
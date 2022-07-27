import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/user.Schema';
import * as jwt from 'jsonwebtoken';
interface JwtPayload {
  userId: string;
}

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): string => {
    try {
      const req = ctx.switchToHttp().getRequest();
      const { authorization } = req.headers;
      const tokenValue = authorization.split(' ')[1];
      const token = jwt.verify(tokenValue, 'MyKey') as JwtPayload;
      console.log(token.userId);
      return token.userId;
    } catch (error) {
      throw new UnauthorizedException('로그인 후 이용해주시오!');
    }
  },
);

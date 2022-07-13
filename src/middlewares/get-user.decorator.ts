import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/schemas/user.Schema';
import * as jwt from 'jsonwebtoken';
interface JwtPayload {
  userId: string;
}

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    const { authorization } = req.headers;
    const tokenValue = authorization.split(' ')[1];
    const token = jwt.verify(tokenValue, 'MyKey') as JwtPayload;
    console.log(token.userId);
    return token.userId;
  },
);

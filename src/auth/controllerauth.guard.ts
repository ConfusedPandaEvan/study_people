import  {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/user.Schema';

import { Observable } from 'rxjs';

import * as jwt from 'jsonwebtoken';
// 아래 꺼랑 바꿀수 있는 라이브러리
// import { JwtService } from '@nestjs/jwt'; 

interface JwtPayload {
    userId: string;
  }

@Injectable()
export class ControllerAuthGuard implements CanActivate{
    // constructor(private readonly jwtService: JwtService){}
    constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();
        try{
        const { authorization } = request.headers;
        const [tokenType, tokenValue] = authorization.split(' ');

        if (tokenType !== 'Bearer') {
            console.log('로그인 후 이용하세요!(타입에러)')
            throw new ForbiddenException('Invalid authorization token')
            ;
          }

        const verified = jwt.verify(tokenValue,'MyKey') as JwtPayload;
        console.log('valid token: ', verified);
        const user = await this.userModel.findById(verified.
            userId)
        if (!user){
            console.log('존재하지 않는 유저입니다  회원가입후 이용하세요!')
            throw new ForbiddenException('존재하지 않는 유저입니다  회원가입후 이용하세요!')
            ;
        }
        request.userId = verified.userId
        request.nickName = user.userNick//데이터베이스에서 찾아서 넣기;
        request.profileImage = user.profileImage

        return true

        }catch{
            throw new ForbiddenException('Invalid authorization token')
        }

    }

}
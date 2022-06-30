import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/schemas/user.Schema';
import * as rp from 'request-promise';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SocialloginService {
    constructor(@InjectModel('User') private userModel: Model<UserDocument>){}

    kakaoLogin() {
        const kakao = {
          clientid: '968fe442549959a4ab2bb530f508c889', //REST API
          // redirectUri: 'http://localhost:3000/main',
          redirectUri: 'https://stupy.co.kr/main',
        };
        // console.log('kakao Client_ID :', kakao.clientid) //undefined
        const kakaoAuthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${kakao.clientid}&redirect_uri=${kakao.redirectUri}`;
        return { url: kakaoAuthURL };
      }
    
    async kakaoLoginMain(@Query() query) {
        const kakao = {
            clientid: '968fe442549959a4ab2bb530f508c889', //REST API
            // redirectUri: 'http://localhost:3000/main',
            redirectUri: 'https://stupy.co.kr/main',
        };

        const { code } = query;
        console.log('service code-->', code); //undefined
        const options = {
            url: 'https://kauth.kakao.com/oauth/token',
            method: 'POST',
            form: {
            grant_type: 'authorization_code',
            client_id: kakao.clientid,
            redirect_uri: kakao.redirectUri,
            code: code,
            },
            headers: {
            'content-type': 'application/x-www-form-urlencoded',
            },
            json: true,
        };
        const kakaotoken = await rp(options);
        console.log('token', kakaotoken);
        const options1 = {
            url: 'https://kapi.kakao.com/v2/user/me',
            method: 'GET',
            headers: {
            Authorization: `Bearer ${kakaotoken.access_token}`,
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            },
            json: true,
        };
        const userInfo = await rp(options1);
        // console.log('userInfo->', userInfo);
        const userId = userInfo.id;
        const userNick = userInfo.kakao_account.profile.nickname;
        console.log('userId-->', userId);
        console.log('userNick-->', userNick);
        const existUser = await this.userModel.findOne({ userId });
        console.log('existUser-->', existUser);

        if (!existUser) {
            const from = 'kakao';
            const userWin = 0;
            const userLose = 0;
            const user = new this.userModel({
            userId,
            userNick,
            });
            console.log('user-->', user);
            await this.userModel.create(user);
        }

        const loginUser = await this.userModel.findOne({ userId });
        console.log('loginUser-->', loginUser);
        const token = jwt.sign({ userId: loginUser[0].userId },'MyKey');
        // console.log("jwtToken-->", token);
        // console.log("User-->", token, userId, userNick);
        return {
            token,
            userId,
            userNick,
            msg: '카카오 로그인 완료.',
        };
        }



}

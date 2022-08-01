import { Injectable, Query, Redirect } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/user.Schema';
import * as rp from 'request-promise';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SocialloginService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}
  async kakaoLoginMain(@Query() query) {
    const kakao = {
      clientid: '968fe442549959a4ab2bb530f508c889',
      redirectUri: 'https://stupy.shop/main',
      // 수정 필요 redirectUri: 'http://13.125.58.110:3000/main',
    };

    const { code } = query;
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
    const kakaouserId = userInfo.id;
    const userNick = userInfo.kakao_account.profile.nickname;
    const email = userInfo.kakao_account.email;
    const existUser = await this.userModel.findOne({ kakaouserId });
    let profileImage = 'https://stupy.shop/profileImages/defaultImage.png';
    if (userInfo.kakao_account.profile.profile_image_url) {
      profileImage = userInfo.kakao_account.profile.profile_image_url;
    }

    if (!existUser) {
      // const from = 'kakao'; 나중에 네이버나 구글서비스 로그인 추가 할 거면 필요
      const user = new this.userModel({
        kakaouserId,
        userNick,
        email,
        profileImage,
      });
      console.log('새로운 유저가 카카오를 통해 회원가입을 하였습니다.! user: ', user)

      await this.userModel.create(user);
    }
    const loginUser = await this.userModel.findOne({ kakaouserId });
    const userId = loginUser.id as string;
    const token = jwt.sign({ userId }, 'MyKey');

    return {
      token,
      userId,
      userNick,
      msg: '카카오 로그인 완료.',
    };
  }

  async naverLogin(query) {
    const naver = {
      clientid: 'iq4Y1nFcUpuQ9_Tpmtb6',
      redirectUri: 'https://stupy.shop/naverlogin',
      client_secret: 'upkjLQQL7d'

      // 수정 필요 redirectUri: 'http://13.125.58.110:3000/main',
    };
    const { code } = query
    const {state} =query
    const options = {
      url: '	https://nid.naver.com/oauth2.0/token',
      method: 'POST',
      form: {
        grant_type: 'authorization_code',
        client_id: naver.clientid,
        client_secret: naver.client_secret,
        // redirect_uri: naver.redirectUri,
        code: code,
        state: state,

      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      json: true,
    };
    // const kakaotoken = await rp(options);
    const {access_token} = await rp(options)
    const options1 = {
      url: 'https://openapi.naver.com/v1/nid/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
        // 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      json: true,
    };
    const userInfo = await rp(options1);
    const naverId = userInfo.response.id;
    const userNick = userInfo.response.name;
    const email = userInfo.response.email;
    let profileImage = userInfo.response.profile_image;
    if (!profileImage){
      profileImage = './public/profileImages/defaultImage.png';
    }
    const existUser = await this.userModel.findOne({ naverId }); 
  
    if (!existUser) {
      // const from = 'kakao'; 나중에 네이버나 구글서비스 로그인 추가 할 거면 필요
      const user = new this.userModel({
        naverId,
        userNick,
        email,
        profileImage,
      });
      console.log('새로운 유저가 네이버를 통해 회원가입을 하였습니다.! user: ', user)

      await this.userModel.create(user);
    }
    const loginUser = await this.userModel.findOne({ naverId });
    const userId = loginUser.id as string;
    const token = jwt.sign({ userId }, 'MyKey');

    return {
      token,
      userId,
      userNick,
      msg: '네이버 로그인 완료 .'
    };
  }
  async findUser(userId: string) {
    return await this.userModel.findOne({ _id: userId });
  }
}

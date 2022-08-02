import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions,Server } from "socket.io";
import { SocketWithAuth } from "src/types";
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service'
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from 'redis';

interface JwtPayload {
    userId: string;
  }

export class SocketIOAdapter extends IoAdapter{
    private adapterConstructor: ReturnType<typeof createAdapter>;
    constructor( private app: INestApplicationContext){
        super(app);
    }

    async connectToRedis(): Promise<void> {
        const pubClient = createClient({ url: `redis://15.164.165.111:6379`});
        const subClient = pubClient.duplicate();
    
        await Promise.all([pubClient.connect(), subClient.connect()]);
    
        this.adapterConstructor = createAdapter(pubClient, subClient);
      }

    createIOServer(port: number, options?: ServerOptions) {
        // const clientPort = parseInt(this.configService.get('CLIENT_PORT'))

        

        const cors = {
            origin:["http://stupy.co.kr","https://stupy.co.kr",'http://localhost:3000','https://localhost:3000'],
            methods: ["GET","POST"],
            credentials: true
        }

        const optionsWithCORS: ServerOptions = {
            ...options,
            cors,
        }

        const usersService = this.app.get(UsersService)
        console.log('1')
        const server: Server = super.createIOServer(port, optionsWithCORS)
        console.log('2')
        server.adapter(this.adapterConstructor)
        console.log('3')
        server.use(createTokenMiddleware(usersService))
        
        
        return server
    }

}

const createTokenMiddleware =  (usersService: UsersService) => async (socket: SocketWithAuth,next) =>{
    try{
        const token = 
        socket.handshake.auth.token || socket.handshake.headers['token']
        const {userId} = jwt.verify(token, 'MyKey') as JwtPayload;
        //DB 에서 유저아이디로 해당 유저 찾기 
  
        const user = await usersService.verifywithtoken(token)
        console.log(user)
        if (!user){
            const token = jwt.sign({ userId: "62e64c886591c11573b38df1" }, 'MyKey');
            console.log('존재하지 않는 유저입니다  회원가입후 이용하세요. 관리자라면 이 토큰을 이용하세요', token)
            throw new Error('존재하지 않는 유저입니다  회원가입후 이용하세요!')
            ;
        }
        socket.userId = userId
        socket.nickName = user.userNick
        socket.profileImage= user.profileImage;
        socket.roomId= socket.handshake.auth.roomId || socket.handshake.auth.roomId ;
        if(!socket.roomId){
            console.log('방을 정해주지 않았습니다!')
            throw new Error('방을 정해주지 않았습니다!')
        }
        console.log('소켓미들웨어 통과')
        next();
    }catch{
        next(new Error('Forbidden'))
    }


    
}
import { INestApplicationContext } from "@nestjs/common";
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions,Server } from "socket.io";
import { SocketWithAuth } from "src/types";
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service'

interface JwtPayload {
    userId: string;
  }

export class SocketIOAdapter extends IoAdapter{
    constructor( private app: INestApplicationContext){
        super(app);
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
        console.log("sdasdas")
        const server: Server = super.createIOServer(port, optionsWithCORS)
        server.use(createTokenMiddleware(usersService))
        
        return server
    }

}

const createTokenMiddleware =  (usersService: UsersService) => async (socket: SocketWithAuth,next) =>{
    try{
        const token = 
        socket.handshake.auth.token || socket.handshake.headers['token']
        const {userId} = jwt.verify(token, 'MyKey') as JwtPayload;
        console.log('userId decoded from jwt',userId)
        //DB 에서 유저아이디로 해당 유저 찾기 
  
        const user = await usersService.verifywithtoken(token)
        console.log(user)
        socket.userId = userId
        socket.nickName = user.userNick
        socket.profileImage= user.profileImage;
        socket.roomId= socket.handshake.auth.roomId || socket.handshake.auth.roomId || 'testtoom';
        console.log(socket.roomId)
        next();
    }catch{
        next(new Error('Forbidden'))
    }


    
}
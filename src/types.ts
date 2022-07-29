import { Request } from "@nestjs/common";
import { Socket } from 'socket.io';


type AuthPayload = {
    userId: string;
    nickName: string;
    profileImage: string;
}
type SocketAuthPayload = {
    userId: string;
    nickName: string;
    profileImage: string;
    roomId: string;
}



export type RequestWithAuth = Request & AuthPayload


export type SocketWithAuth = Socket & SocketAuthPayload

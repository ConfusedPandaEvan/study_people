import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { joinroomDto } from './dto/joinroom.dto';
import { Server, Socket } from 'socket.io';

import { Users } from './entities/users.entity'
import { SockettoRoom } from './entities/sockettoroom.entity';
import { getOfferDto } from './dto/getoffer.dto';
import { getAnserDto } from './dto/getanswer.dto';
import { getCandidateDto } from './dto/getcandidate.dto';
@WebSocketGateway({
  transports: ['websocket','polling'],
  cors:{
    origin:"*",
    methods: ["GET","POST"],
    credentials: false
  },
  allowEIO3: true
})
export class MessageGateway {

  users = { '123456': [ { id: 'testsocketid', userid: 'test' }]}
  socketToRoom = {'123456':'123456'} 
  


  @WebSocketServer()
  server: Server;
  
  constructor(private readonly messageService: MessageService) {}


  @SubscribeMessage('disconnect')
  
  // public handleConnection(client: Socket): void {
  //   console.log('새로운 유저입장!!!!',`connection: ${client.id}`);
  // }
  public handleDisconnect(client: Socket): void {
    console.log(`[${this.socketToRoom[client.id]}]: ${client.id} exit`);
    const roomID = this.socketToRoom[client.id];
        let room = this.users[roomID];
        if (room) {
            room = room.filter((user) => user.id !== client.id);
            this.users[roomID] = room;
            if (room.length === 0) {
                delete this.users[roomID];
                return;
            }
        }
        this.server.to(roomID).emit('user_exit', {id: client.id});
        console.log(this.users);
  }
  @SubscribeMessage('join_room')
  joinRoom(@MessageBody() data: joinroomDto, @ConnectedSocket() client: Socket){

    if (this.users[data.room]) {
      const length = this.users[data.room].length;
      if (length === 4) {
          this.server.to(client.id).emit('room_full');
          return;
      }
      this.users[data.room].push({id: client.id, userid: data.userid});
  } else {
      this.users[data.room] = [{id: client.id, userid: data.userid}];
  }


  this.socketToRoom[client.id] = data.room;

  client.join(data.room);
  console.log(`[${this.socketToRoom[client.id]}]: ${client.id} enter`);

  const usersInThisRoom = this.users[data.room].filter(user => user.id !== client.id);

  console.log(usersInThisRoom);

  this.server.sockets.to(client.id).emit('all_users', usersInThisRoom);

  }

  
    
  
  @SubscribeMessage('offer')
  getoffer(@MessageBody() data: getOfferDto, @ConnectedSocket() client: Socket){
    this.server.to(data.offerReceiveID).emit('getOffer', {sdp: data.sdp, offerSendID: data.offerSendID, offerSendUserId: data.offerSendUserId});
  }

  @SubscribeMessage('answer')
  getanswer(@MessageBody() data: getAnserDto, @ConnectedSocket() client: Socket){
    this.server.to(data.answerReceiveID).emit('getAnswer', {sdp: data.sdp, answerSendID: data.answerSendID});
  }

  @SubscribeMessage('candidate')
  getcandidate(@MessageBody() data: getCandidateDto, @ConnectedSocket() client: Socket){
    this.server.to(data.candidateReceiveID).emit('getCandidate', {candidate: data.candidate, candidateSendID: data.candidateSendID});
  }


  // @SubscribeMessage('disconnect')
  // disconnect( @ConnectedSocket() client: Socket){
  //   console.log(`[${this.socketToRoom[client.id]}]: ${client.id} exit`);
  //       const roomID = this.socketToRoom[client.id];
  //       let room = this.users[roomID];
  //       if (room) {
  //           room = room.filter((user) => user.id !== client.id);
  //           this.users[roomID] = room;
  //           if (room.length === 0) {
  //               delete this.users[roomID];
  //               return;
  //           }
  //       }
  //       this.server.to(roomID).emit('user_exit', {id: client.id});
  //       console.log(this.users);
  // }

  //채팅보내기
  @SubscribeMessage('createMessage')
  create(@MessageBody() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }
  // 채팅 내보내기
  @SubscribeMessage('findAllMessage')
  findAll() {
    return this.messageService.findAll();
  }



  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messageService.findOne(id);
  }


  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messageService.remove(id);
  }
}


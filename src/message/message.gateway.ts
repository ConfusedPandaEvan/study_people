import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket,WsException } from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { joinroomDto } from './dto/joinroom.dto';
import { Server, Socket } from 'socket.io';
import { Room } from 'src/room/room.model';
import { SockettoRoom } from './entities/sockettoroom.entity';
import { getOfferDto } from './dto/getoffer.dto';
import { getAnserDto } from './dto/getanswer.dto';
import { getCandidateDto } from './dto/getcandidate.dto';
import { NotFoundException } from '@nestjs/common';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { Chat } from 'src/chats/chat.Schema';
import { User } from 'src/users/user.Schema';
import { Time } from 'src/times/time.Schema';
import * as jwt from 'jsonwebtoken';
interface JwtPayload {
  userId: string;
}

@WebSocketGateway({
  transports: ['websocket','polling'],
  cors:{
    // origin:'*',
    origin:["http://stupy.co.kr","https://stupy.co.kr"],
    methods: ["GET","POST"],
    credentials: true
  },
  allowEIO3: true
})

// @WebSocketGateway(5000, {
//   transports: ['websocket'],
//   cors: {
//     origin: '*',
//   },ggggggggggggggg
// })
export class MessageGateway {

  users = { '123456': [ { id: 'testsocketid', userid: 'test' }]}
  socketToRoom = {'123456':'123456'} 
  // public starttime: Date
  // public endtime: Date


  @WebSocketServer()
  server: Server;
  
  constructor( @InjectModel('Room') private readonly roomModel: Model<Room>,
  @InjectModel('Chat') private readonly chatModel: Model<Chat>,
  @InjectModel('User') private readonly userModel: Model<User>,
  @InjectModel('Time') private readonly timeModel: Model<Time>,
  private readonly messageService: MessageService){}


  public handleConnect(client: Socket): void {
    console.log(client.id)
  }

  @SubscribeMessage('disconnect')
  
  public handleConnection(client: Socket): void {
    console.log('새로운 유저입장!!!!',`connection: ${client.id}`);
    const token = client.handshake.auth.token

    try {
      const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
      this.userModel.findOne({ _id: verifiedtoken.userId }).then((user) => {
        console.log(verifiedtoken.userId,'유저의 검증된 토큰값:',verifiedtoken)
      });
    } catch (err) {
      throw new WsException(
        {
          status: 'error',
          errorMessage: 'Invalid credentials.(토큰검증에러)',
        },
      );
    }
    

  }
  public async handleDisconnect(client: Socket): Promise<void> {
    console.log(`[${this.socketToRoom[client.id]}]: ${client.id} exit`);
    const roomID = this.socketToRoom[client.id];
        let room = this.users[roomID];

        //타이머 기능 추가 우선 5 초 이상 머물러야 기록함
        // this.endtime = new Date()
        // const timediffinms = this.endtime.getTime() - this.starttime.getTime();
        // if (timediffinms >= 5000){
        //   const newtime = new this.timeModel({
        //     roomId:roomID,
        //     userId: room.userid,
        //     studytime: timediffinms
        //   })
          
        //   await newtime.save()
        //   console.log('studytime has been saved')
        // } else {
        //   console.log('studytime has not been saved')
        // }


        


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

  //join_room 으로 받는 데이터 {roomId: string}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  @SubscribeMessage('join_room')
  async joinRoom(@MessageBody() data: joinroomDto, @ConnectedSocket() client: Socket){
    const token = client.handshake.auth.token
    const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    const joineduserid = verifiedtoken.userId
    // const room = await this.roomModel.findById(data.roomId)
    // console.log(room.users)
    // if(room.users.includes(data.userId)){


    // }
    if (this.users[data.roomId]) {
      const length = this.users[data.roomId].length;
      if (length === 4) {
          console.log('room is full!!!!!!!!!!')
          this.server.to(client.id).emit('room_full');
          return;
      }
      this.users[data.roomId].push({id: client.id, userid: joineduserid});
  } else {
      this.users[data.roomId] = [{id: client.id, userid: joineduserid}];
  }
  console.log('current users',this.users)

  this.socketToRoom[client.id] = data.roomId;
  console.log('current socketTORoom ',this.socketToRoom)

  client.join(data.roomId);
  console.log(`: userId :${client.id} has entered roomID: [${this.socketToRoom[client.id]}]`);

  const usersInThisRoom = this.users[data.roomId].filter(user => user.id !== client.id);
  console.log('alluser in the room rightnow',this.users[data.roomId]);
  console.log('userinthisroom (not including oneself)',usersInThisRoom);
  // this.starttime = new Date()
  // const timestarted = this.starttime
  //populate 과 execute를 사용하면 objectID 를 참조하여 JOIN 처럼 사용가능
  const chatInThisRoom = await this.chatModel.find({roomId:data.roomId}).populate("userId");
  const datatoclient = {
    usersInThisRoom,
    chatInThisRoom,
    // timestarted
  }
  this.server.sockets.to(client.id).emit('all_users', datatoclient);
  // datatoclient.chatInThisRoom.userId.userNick 안에 닉네임이 들어가게씀 줘라 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
  // userId 를 못받는다 토큰을 풀어서 유저 아이디를 사용하자 받는 데이터는 {roomId: string, conetent: string} !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  @SubscribeMessage('MessageFromClient')
  async createMessage(@MessageBody() createChatDto: CreateChatDto,@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token
    const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    const joineduserid = verifiedtoken.userId
    const chat = new this.chatModel({
      ...createChatDto,
      userId:joineduserid,
      createdAt: new Date()
    })
    await chat.save()
    const newchat = await this.chatModel.findById(chat._id).populate("userId")
    console.log('the message has been saved to the DB: ',createChatDto.content,)
    client.broadcast.to(createChatDto.roomId).emit('chatForOther', newchat);
    // newchat 안에 usernick 담아서 줄것 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // return this.createMessage(createChatDto,client);
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


  ///private functions: migrate to message.service
  // private async findRoom(id: string): Promise<Room> {
  //   let room;
  //   try {
  //     room = await this.roomModel.findById(id).exec();
  //   } catch (error) {
  //     throw new NotFoundException('Could Not Find Room');
  //   }
  //   if (!room) {
  //     throw new NotFoundException('Could Not Find Room');
  //   }
  //   return room;
  // }
}


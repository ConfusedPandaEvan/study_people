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
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { Chat } from 'src/chats/chat.Schema';
import { User } from 'src/users/user.Schema';
import { Time } from 'src/times/time.Schema';
import * as jwt from 'jsonwebtoken';
import { SocketWithAuth } from 'src/types';
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

  users = { 'testroomid': [ { id: 'testsocketid', userid: 'test',joinedtime: 1000 }]}
  socketToRoom = {'testsocketid':'testroomid'} 
  //접속성공하면 현재 내 방 이라는 변수 안에 방 아이디 불러오기
  //접속성공하면 현재 접속유저 변수 안에 유저 인포 불러오기 
  public usertosocket = {'userid':'socketid'}
  // public allonlineuser =[]

  @WebSocketServer()
  server: Server;
  
  constructor( @InjectModel('Room') private readonly roomModel: Model<Room>,
  @InjectModel('Chat') private readonly chatModel: Model<Chat>,
  @InjectModel('User') private readonly userModel: Model<User>,
  @InjectModel('Time') private readonly timeModel: Model<Time>,
  private readonly messageService: MessageService){}


  // public handleConnect(client: Socket): void {
  //   console.log(client.id)
  //   const token = client.handshake.auth.token
  //   const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
  //   const joineduserid = verifiedtoken.userId

  // }

  // @SubscribeMessage('disconnect')
  
  public handleConnection(client: SocketWithAuth): void {
    
    console.log('새로운 유저입장!!!!',`connection: ${client.id}`);
    console.log('소켓연결 됬을때 기능점검')
    console.log('userid: ',client.userId)
    console.log('nickName: ',client.nickName)
    console.log('roomId: ',client.roomId)
    console.log('profileImage: ',client.profileImage);
    const token = client.handshake.auth.token || client.handshake.headers['token']
    
    // try {
    //   const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    //   this.userModel.findOne({ _id: verifiedtoken.userId }).then((user) => {
    //     console.log(verifiedtoken.userId,'유저의 검증된 토큰값:',verifiedtoken)
    //   });
    // } catch (err) {
    //   console.log('Invalid credentials.(토큰검증에러)')
    //   throw new UnauthorizedException('Invalid credentials.(토큰검증에러)');
    // }

    // const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    // const joineduserid = verifiedtoken.userId

    // if (this.allonlineuser.includes(client.userId)) {
    //   client.disconnect()
    //   return
    // } else {
    //   this.allonlineuser.push(client.userId)
    // }

    // console.log('all online user after connection: ', this.allonlineuser)
    
  }
  public async handleDisconnect(client: SocketWithAuth): Promise<void> {

    // const index = this.allonlineuser.indexOf(client.userId);
    //     if (index > -1) { // only splice array when item is found
    //       this.allonlineuser.splice(index, 1); // 2nd parameter means remove one item only
    //     }

        console.log(`[${this.socketToRoom[client.id]}]: ${client.id} exit`);
        // console.log('all online user after disconnection: ', this.allonlineuser)
    
    const token = client.handshake.auth.token || client.handshake.headers['token']
    const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    const joineduserid = verifiedtoken.userId
    const roomID = this.socketToRoom[client.id];
    let room = this.users[roomID];
    if(room){
      let findeduser = room.filter((eachuser)=> eachuser.userid ===joineduserid) 
      room = room.filter((user) => user.id !== client.id);
      this.users[roomID] = room;
      
      let endtime = new Date().getTime()
        // 타이머 기능 추가 우선 5 초 이상 머물러야 기록함
        if (findeduser[0]){
          const timediffinms = endtime - findeduser[0].joinedtime;
          if (timediffinms >= 5000){
            
            const targettime = this.timeModel.findOne({roomId:client.roomId,userId:client.userId})
            if (!targettime){
              const newtime = new this.timeModel({
                roomId:roomID,
                userId: joineduserid,
                studytime: timediffinms
              })
              
              await newtime.save()
              console.log('first study time has been saved')
            } else {
              await targettime.updateOne({$inc: {studytime: timediffinms }})
              console.log('studytime has been updated')
            }

          } else {
            console.log(joineduserid,' this users studytime is too short, it has not been saved')
          }
        }
        if (room.length === 0) {
          delete this.users[roomID];
          delete this.socketToRoom[client.id]
          return;
        }
        
        console.log('소켓연결 끊길때 기능점검:  ')
        console.log('userid: ',client.userId)
        console.log('nickName: ',client.nickName)
        console.log('roomId: ',client.roomId)
        console.log('profileImage: ',client.profileImage);
    }
  

        // if (this.allonlineuser.includes(client.userId)) {
        //   const errormessage = '이미 채팅방에 접속중인 유저입니다.'
        //   console.log('이미 채팅방에 접속중인 유저입니다.')
        //   this.server.to(roomID).emit('user_exit', {id: client.userId})
        //   client.emit('disconnectuser',errormessage)
        //   return
        // }

        // const index = this.allonlineuser.indexOf(client.userId);
        // if (index > -1) { // only splice array when item is found
        //   this.allonlineuser.splice(index, 1); // 2nd parameter means remove one item only
        // }

        // console.log('퇴장 후 지금 서버에 연결된 소켓: ', this.allonlineuser)
  

        

        // if (room) {
        //     room = room.filter((user) => user.id !== client.id);
        //     this.users[roomID] = room;
        //     if (room.length === 0) {
        //         delete this.users[roomID];
        //         delete this.socketToRoom[client.id]
        //         return;
        //     }
        // }

        // delete this.socketToRoom[client.id]
        //         console.log(this.users);


        
        // delete this.usertosocket[joineduserid];
        this.server.to(roomID).emit('user_exit', {id: client.id});

  }



  //join_room 으로 받는 데이터 {roomId: string}!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  @SubscribeMessage('join_room')
  async joinRoom(@MessageBody() data: joinroomDto, @ConnectedSocket() client: SocketWithAuth){
    // const token = client.handshake.auth.token || client.handshake.headers['token']
    // const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    // const joineduserid = verifiedtoken.userId
    // const room = await this.roomModel.findById(data.roomId)
    // console.log(room.users)
    // if(room.users.includes(data.userId)){
    let starttime = new Date().getTime()
    //방장인지 아닌지? true/false !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  
    let roomOwner = false
  
  const thisroom = await this.roomModel.findById(data.roomId)
  if(thisroom.users[0]===client.userId){
    roomOwner = true
    console.log('해당유저는 이 방의 방장입니다.')
  }
  //블랙리스트에 저장되어있으면 코드진행 X
  if (thisroom.blackList && thisroom.blackList.includes(client.userId)) {
    const errormessage = '블랙리스트라서 방에 입장할수없습니다'
    client.emit('disconnectuser',errormessage)
    console.log('블랙리스트라서 방에 입장할수없습니다. ')
    return
    // throw new ForbiddenException('blocked by the owner.(블랙리스트)')
  }
  //방이 꽉 차고, 내 아이디가 룸 안에 저장 안되있으면 코드진행 X


  if (thisroom.users.length === thisroom.maxPeople && !thisroom.users.includes(client.userId)){
    //이코드가 작동 안하는거 같은데, return 을써보자
    
    const errormessage = '해당방이 정원 초과라서 입장 할 수 없습니다'
    client.emit('disconnectuser',errormessage)
    console.log('해당방이 정원 초과라서 입장 할 수 없습니다' )
    return
    // throw new WsException(
    //   '해당방이 정원 초과라서 입장 할 수 없습니다 ~~~~~~~~~~~~',
    // );
  }

  //방이 꽉 차지 않았고, 내 유저아이디가 방 안에 없으면 방안에 넣어주고 코드진행
  if (thisroom.users.length < thisroom.maxPeople && !thisroom.users.includes(client.userId)){
    await this.roomModel.updateOne(
      { _id: data.roomId },
      { $push: { users: client.userId }, $inc: { usersNum: 1 } },
    );
    console.log('유저의 아이디가 방에 성공적으로 저장됨')
  }

  //방이 꽉 차지 않았고, 내 유저 아이디가 방안에 있으면 그냥 코드진행. 
  //방이 꽉 찼고,내 유저 아이디가 방 안에 가입되어있으면 코드진행

  



  if (this.users[data.roomId]) {
    const length = this.users[data.roomId].length;
    if (length === 4) {
      const errormessage = '방이 꽉찼습니다'
      console.log('방이 꽉찼습니다' )
      client.emit('disconnectuser',errormessage)
      
        // this.server.to(client.id).emit('room_full');
      return;
    }
    this.users[data.roomId].push({id: client.id, userid: client.userId, joinedtime: starttime});
  } else {
      this.users[data.roomId] = [{id: client.id, userid: client.userId, joinedtime: starttime}];
  }
  console.log('current users',this.users)

  this.socketToRoom[client.id] = data.roomId;
  console.log('current socketTORoom ',this.socketToRoom)

  client.join(data.roomId);
  console.log(`: userId :${client.id} has entered roomID: [${this.socketToRoom[client.id]}]`);

  const usersInThisRoom = this.users[data.roomId].filter(user => user.id !== client.id);
  console.log('alluser in the room rightnow',this.users[data.roomId]);
  console.log('userinthisroom (not including oneself)',usersInThisRoom);
  
  

  // const timestarted = this.starttime
  // populate 과 execute를 사용하면 objectID 를 참조하여 JOIN 처럼 사용가능
  const chatInThisRoom = await this.chatModel.find({roomId:data.roomId});
  const datatoclient = {
    usersInThisRoom,
    chatInThisRoom,
    roomOwner,
  }
  this.server.sockets.to(client.id).emit('all_users', datatoclient);
  // datatoclient.chatInThisRoom.userId.userNick 안에 닉네임이 들어가게씀 줘라 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  }


  //data 에선 roomId 랑 targetId
  @SubscribeMessage('addblacklist')
  async blacklist(@MessageBody() data , @ConnectedSocket() client: SocketWithAuth){
    const token = client.handshake.auth.token || client.handshake.headers['token']
    const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    const joineduserid = verifiedtoken.userId
    const thisroom = await this.roomModel.findById(data.roomId)
    if (thisroom.users[0] !== joineduserid) {
      throw new WsException(
        {
          status: 'error',
          errorMessage: 'you are not the owner.(방장만 블랙리스트보낼수있음)',
        })
    }
    if (thisroom.users.includes(data.targetId)) {
      try {
        await this.roomModel.updateOne(
          { _id: data.roomId },
          { $pull: { users: data.targetId }, $inc: { usersNum: -1 } },
        );

        await this.roomModel.updateOne(
          { _id: data.roomId },
          { $push: { blackList: data.targetId } },
        );
      } catch (error) {
        console.log(error);
        throw new WsException(
          '이 방에 없는 사람은 원해도 없엘 수 없어요,,, target 다시 확인해주세요',
        );
      }
    } else {
      throw new WsException(
        '이 방에 없는 사람은 원해도 없엘 수 없어요,,, target 다시 확인해주세요',
      );
    }

    console.log('해당유저 데이터 베이스에서 삭제후 블랙리스트 추가 완료')

    // 채팅 지우는 부분은
    this.chatModel.deleteMany({roomId:data.roomId, userId:data.targetId}).then(function(){
      console.log("Data deleted"); // Success
    }).catch(function(error){
        console.log(error); // Failure
    });

    // const index = this.allonlineuser.indexOf(data.targetId);
    //     if (index > -1) { // only splice array when item is found
    //       this.allonlineuser.splice(index, 1); // 2nd parameter means remove one item only
    //     }

    console.log('해당유저의 해당채팅방안에서의 채팅기록 삭제 완료')
    const targetuserinfo = this.users[data.roomId].filter(user=> user.userid === data.targetId)
    const targetsocketid = targetuserinfo[0].id
    //클라이언트에서 disconnect처리 해주어야 될수도 있음
    const errormessage = '방장에 의해 강퇴당했습니다.'
    this.server.to(data.roomID).emit('user_exit', {id: targetsocketid});
    console.log('강퇴 발생')
    this.server.to(targetsocketid).emit('disconnectuser',errormessage)
    
    
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
    const token = client.handshake.auth.token || client.handshake.headers['token']
    const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    const joineduserid = verifiedtoken.userId

    const user = await this.userModel.findOne({ _id: joineduserid})
    const newchat = new this.chatModel({
      ...createChatDto,
      userId:user,
      createdAt: new Date()
    })
    await newchat.save()
    console.log('the message has been saved to the DB: ',createChatDto.content,newchat)
    client.broadcast.to(createChatDto.roomId).emit('chatForOther', newchat);
    // newchat 안에 usernick 담아서 줄것 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // return this.createMessage(createChatDto,client);
  }

  //타이머 토글을 켜고 각 유저의 공부시간을 받고싶을때(timertoggleon)
  @SubscribeMessage('timertoggleon')
  async timeinfo(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token || client.handshake.headers['token']
    const verifiedtoken = jwt.verify(token, 'MyKey') as JwtPayload;
    const joineduserid = verifiedtoken.userId

    

    const roomid = this.socketToRoom[client.id]

    // 룸아이디에서 있는 유저들을 for 문을 돌린다. 그리고는 맵을 해준다. 
    // 프사 url, nickNAME(user가서 아이디로 또 찾아서 줘야함), 기록: 현재시간 - 접속시간 주면됨, 누적, 체팅 찾아서 더해서 주면됨.)
    console.log(roomid)
    const room = await this.roomModel.findById(roomid);
    console.log(room)
    const roomusers = room.users
    let data = []
    for (let eachuserid of roomusers){
      let user = await this.userModel.findById(eachuserid);
      let time = await this.timeModel.findOne({roomId:roomid,userId:eachuserid})

      //[{userid:, roomid: ,studytime,},{}]
      let accumtime: number
      if(!time){
        accumtime = 0
      } else {
        accumtime = time.studytime
      }
      
      let connecteduser = this.users[roomid]
      let connecteduserid = []

      for (let eachuser of connecteduser){
        connecteduserid = [... connecteduserid,eachuser.userid]
      }
      // let connecteduserid = connecteduser.map((eachuser)=>{
      //   eachuser.userid
      // })

      let currentrecord = 0
      let timeNow = new Date().getTime()
      if (connecteduserid.includes(eachuserid)){
        const findeduser = this.users[roomid].filter((eachuser)=>eachuser.userid === eachuserid)
        currentrecord = timeNow - findeduser[0].joinedtime
      }

      let eachdata = {
        profilepic: user.profileImage,
        userId: user._id,
        nickName:user.userNick,
        currentrecord: currentrecord,
        accumrecord: accumtime
        // online: online
      }
      data = [...data,eachdata]
    }

    data.sort((a,b)=>{
      return b.accumrecord - a.accumrecord
    })

    client.emit('timeinfos', data);
    //data: [... {profilepic,nickName,currentrecord,accumrecord,online}]
  }


  @SubscribeMessage('kicktoggleon')
  async userinfo(@ConnectedSocket() client: SocketWithAuth) {

    // 룸아이디에서 있는 유저들을 for 문을 돌린다. 그리고는 맵을 해준다. 
    // 프사 url, nickNAME(user가서 아이디로 또 찾아서 줘야함), 기록: 현재시간 - 접속시간 주면됨, 누적, 체팅 찾아서 더해서 주면됨.)

    const room = await this.roomModel.findById(client.roomId);
    console.log(room)
    const roomusers = room.users
    let data = []
    for (let eachuserid of roomusers){
      let user = await this.userModel.findById(eachuserid);
      let connecteduser = this.users[client.roomId]
      let connecteduserid = []

      for (let eachuser of connecteduser){
        connecteduserid = [... connecteduserid,eachuser.userid]
      }

      let eachdata = {
        profilepic: user.profileImage,
        userId: user._id,
        nickName:user.userNick
      }
      data = [...data,eachdata]
    }

    client.emit('userInfos', data);
    //data: [... {profilepic,nickName,userId}] 방장이면 맨 위에
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


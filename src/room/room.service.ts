import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hashtag } from './hashtag.model';
import { Room } from './room.model';
import * as fs from 'fs';
import { User } from 'src/users/user.Schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('Hashtag') private readonly hashtagModel: Model<Hashtag>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getAllRooms(sort) {
    let rooms = [];

    switch (sort) {
      case 'latest':
        rooms = await this.roomModel.find().sort({ createdAt: -1 }).exec();
        break;
      case 'popularity':
        rooms = await this.roomModel.find().sort({ usersNum: -1 }).exec();
        break;
      //Needs to be Updated
      case 'open':
        rooms = await this.roomModel.find().sort({ usersNum: -1 }).exec();
        rooms = rooms.filter((room) => room.usersNum < room.maxPeople);
        break;
      default:
        rooms = await this.roomModel.find().exec();
        break;
    }

    return rooms.map((roomL) => ({
      roomId: roomL._id,
      title: roomL.title,
      usersNum: roomL.usersNum,
      maxPeople: roomL.maxPeople,
      content: roomL.content,
      hashtags: roomL.hashtags,
      openKakao: roomL.openKakao,
      image: 'https://stupy.shop/roomImages/' + roomL.imageLocation,
    }));
  }

  async getMyRooms(userId) {
    let rooms = await this.roomModel.find({ users: userId }).exec();
    if (rooms.length == 0) {
      rooms = [];
    }
    return rooms.map((roomL) => ({
      roomId: roomL._id,
      title: roomL.title,
      usersNum: roomL.usersNum,
      maxPeople: roomL.maxPeople,
      content: roomL.content,
      hashtags: roomL.hashtags,
      openKakao: roomL.openKakao,
      image: 'https://stupy.shop/roomImages/' + roomL.imageLocation,
    }));
  }

  async leaveRoom(roomId, userId) {
    const targetRoom = await this.findRoom(roomId);

    //When leaving, if the person is the only one in the room, delete room. If not, just remove the user from room
    if (targetRoom.users.length == 1) {
      this.deleteRoom(roomId, userId);
    } else {
      await this.roomModel.updateOne(
        { _id: roomId },
        { $pull: { users: userId }, $inc: { usersNum: -1 } },
      );
    }

    await this.userModel.updateOne(
      { _id: userId },
      { $inc: { joinedRoomNum: -1 } },
    );
  }

  async enterRoom(roomId, userId, password) {
    // async enterRoom(roomId, userId) {
    const targetRoom = await this.findRoom(roomId);
    const user = await this.userModel.findById(userId);
    //Check if the room exists
    if (!targetRoom) {
      throw new BadRequestException('존재하지 않는 방입니다.');
    }
    //Blacklist Check
    if (targetRoom.blackList && targetRoom.blackList.includes(userId)) {
      throw new UnauthorizedException('당신은 방장한테 찍혀서 접근 못해요');
    }

    if (user.joinedRoomNum == 5 && !targetRoom.users.includes(userId)) {
      throw new BadRequestException('최대 가입 가능한 방의 갯수는 5개입니다.');
    }

    // Password Check
    if (targetRoom.password !== password) {
      throw new UnauthorizedException('비밀번호 틀렸습니다.');
    }

    //People number Check
    if (
      targetRoom.users.length == targetRoom.maxPeople &&
      !targetRoom.users.includes(userId)
    ) {
      throw new BadRequestException('이 방은 이미 만원입니다.');
    }

    //Only Add the userId if it does not exist
    if (!targetRoom.users.includes(userId)) {
      await this.roomModel.updateOne(
        { _id: roomId },
        { $push: { users: userId }, $inc: { usersNum: 1 } },
      );
      await this.userModel.updateOne(
        { _id: userId },
        { $inc: { joinedRoomNum: 1 } },
      );
    }
    return true;
  }
  async beforesocket(roomId, userId) {
    // async enterRoom(roomId, userId) {
    const targetRoom = await this.findRoom(roomId);
    const user = await this.userModel.findById(userId);
    //Check if the room exists
    if (!targetRoom) {
      throw new BadRequestException('존재하지 않는 방입니다.');
    }
    //Blacklist Check
    if (targetRoom.blackList && targetRoom.blackList.includes(userId)) {
      throw new UnauthorizedException('당신은 방장한테 찍혀서 접근 못해요');
    }

    if (user.joinedRoomNum == 5 && !targetRoom.users.includes(userId)) {
      throw new BadRequestException('최대 가입 가능한 방의 갯수는 5개입니다.');
    }

    //People number Check
    if (
      targetRoom.users.length == targetRoom.maxPeople &&
      !targetRoom.users.includes(userId)
    ) {
      throw new BadRequestException('이 방은 이미 만원입니다.');
    }

    //Only Add the userId if it does not exist
    if (!targetRoom.users.includes(userId)) {
      await this.roomModel.updateOne(
        { _id: roomId },
        { $push: { users: userId }, $inc: { usersNum: 1 } },
      );
      await this.userModel.updateOne(
        { _id: userId },
        { $inc: { joinedRoomNum: 1 } },
      );
    }
    return true;
  }
  async changeOwner(roomId, removeUserDto, userId) {
    const targetRoom = await this.findRoom(roomId);
    const target = removeUserDto.targetId;

    //Check Room Owner
    if (targetRoom.users[0] !== userId) {
      throw new UnauthorizedException('당신은 이 공간의 주인이 아닙니다.');
    }

    if (targetRoom.users.includes(target)) {
      try {
        await this.roomModel.updateOne(
          { _id: roomId },
          { $pull: { users: target } },
        );

        await this.roomModel.updateOne(
          { _id: roomId },
          { $push: { users: { $each: [target], $position: 0 } } },
        );
      } catch (error) {
        console.log(error);
        throw new NotFoundException(
          '이 방에 없는 사람은 주인으로 임명할 수 없습니다. target 다시 확인해주세요',
        );
      }
    } else {
      throw new NotFoundException(
        '이 방에 없는 사람은 주인으로 임명할 수 없습니다. target 다시 확인해주세요',
      );
    }

    return null;
  }

  async removeUser(roomId, removeUserDto, userId) {
    const targetRoom = await this.findRoom(roomId);
    const target = removeUserDto.targetId;

    //Check Room Owner
    if (targetRoom.users[0] !== userId) {
      throw new UnauthorizedException('당신은 이 공간의 주인이 아닙니다.');
    }

    if (targetRoom.users.includes(target)) {
      try {
        await this.roomModel.updateOne(
          { _id: roomId },
          { $pull: { users: target }, $inc: { usersNum: -1 } },
        );

        await this.roomModel.updateOne(
          { _id: roomId },
          { $push: { blackList: target } },
        );
      } catch (error) {
        console.log(error);
        throw new NotFoundException(
          '이 방에 없는 사람은 원해도 없엘 수 없어요,,, target 다시 확인해주세요',
        );
      }
    } else {
      throw new NotFoundException(
        '이 방에 없는 사람은 원해도 없엘 수 없어요,,, target 다시 확인해주세요',
      );
    }

    return null;
  }

  async getRoomTitle(roomId) {
    const targetRoom = await this.findRoom(roomId);
    return targetRoom.title;
  }

  async createRoom(file, createRoomDto, userId) {
    //Default Image if image is not provided

    const user = await this.userModel.findById(userId);
    if (user.joinedRoomNum == 5) {
      throw new BadRequestException(
        '최대 가입할수있는 가능한 방의 갯수는 5개입니다.',
      );
    }

    let filename = '';
    if (file) {
      filename = file.filename;
    }

    //change JSON Object to Array Object
    let hashtags = [];

    if (createRoomDto.hashtag) {
      const hashtagsinfo = createRoomDto.hashtag
        .toString()
        .replace(/\[|\]/g, '')
        .replace(/\s/g, '')
        .split(',');

      hashtags = [...new Set(hashtagsinfo)];
    }

    const newRoom = new this.roomModel({
      ...createRoomDto,
      hashtags,
      users: userId,
      usersNum: 1,
      imageLocation: filename,
      createdAt: new Date(),
      lastVisited: new Date(),
    });

    const result = await newRoom.save();

    //create hashtags based on new room
    for (let i = 0; i < newRoom.hashtags.length; i++) {
      const tag = newRoom.hashtags[i];
      const dbHashtag = await this.findHashtag(tag);

      //if no hashtag exists, create one
      if (!dbHashtag) {
        const newHashtag = new this.hashtagModel({
          content: tag,
          rooms: [result.id as string],
        });

        await newHashtag.save();
      }

      //if it exists, add roomId
      else {
        await this.hashtagModel.updateOne(
          { _id: dbHashtag._id },
          { $push: { rooms: result.id } },
        );
      }
    }

    //return id of created room
    return result.id as string;
  }

  async deleteRoom(roomId, userId) {
    const targetRoom = await this.findRoom(roomId);

    //Check Room Owner
    if (targetRoom.users[0] !== userId) {
      throw new UnauthorizedException(
        "You don't have access to delete this room",
      );
    }

    for (let i = 0; i < targetRoom.hashtags.length; i++) {
      const tag = targetRoom.hashtags[i];
      const dbHashtag = await this.findHashtag(tag);

      //If hashtag length is 1, delete hashtag from DB, else, remove roomId from hashtag.rooms
      if (dbHashtag.rooms.length == 1) {
        await this.hashtagModel.deleteOne({ _id: dbHashtag._id }).exec();
      } else {
        await this.hashtagModel.updateOne(
          { _id: dbHashtag._id },
          { $pull: { rooms: roomId } },
        );
      }
    }

    //delete the room from db
    await this.roomModel.deleteOne({ _id: roomId }).exec();

    //delete image from local storage
    if (targetRoom.imageLocation != '') {
      await fs.unlink(
        `./public/roomImages/${targetRoom.imageLocation}`,
        (err) => {
          if (err) {
            console.error(err);
            return err;
          }
        },
      );
    }

    return null;
  }

  async updateRoom(file, roomId, updateRoomDto, userId) {
    const targetRoom = await this.findRoom(roomId);
    let filename = targetRoom.imageLocation;
    let hashtags = targetRoom.hashtags;

    //Check Room Owner
    if (targetRoom.users[0] !== userId) {
      throw new UnauthorizedException(
        "You don't have access to delete this room",
      );
    }

    //if new image is provided, delete original image
    if (file) {
      filename = file.filename;
      if (targetRoom.imageLocation != '') {
        await fs.unlink(
          `./public/roomImages/${targetRoom.imageLocation}`,
          (err) => {
            if (err) {
              console.error(err);
              return err;
            }
          },
        );
      }
    }

    //reset Hashtags
    if (updateRoomDto.hashtag) {
      for (let i = 0; i < targetRoom.hashtags.length; i++) {
        const tag = targetRoom.hashtags[i];
        const dbHashtag = await this.findHashtag(tag);

        //If hashtag length is 1, delete hashtag from DB, else, remove roomId from hashtag.rooms

        if (dbHashtag.rooms.length == 1) {
          await this.hashtagModel.deleteOne({ _id: dbHashtag._id }).exec();
        } else {
          await this.hashtagModel.updateOne(
            { _id: dbHashtag._id },
            { $pull: { rooms: roomId } },
          );
        }
      }

      //change JSON Object to Array Object

      hashtags = updateRoomDto.hashtag
        .toString()
        .replace(/\[|\]/g, '')
        .replace(/\s/g, '')
        .split(',');

      //recreate Hashtags
      for (let i = 0; i < hashtags.length; i++) {
        const tag = hashtags[i];
        const dbHashtag = await this.findHashtag(tag);

        //if no hashtag exists, create one
        if (!dbHashtag) {
          const newHashtag = new this.hashtagModel({
            content: tag,
            rooms: [roomId as string],
          });
          await newHashtag.save();
        }
      }
    }

    await this.roomModel.updateOne(
      { _id: roomId },
      {
        $set: {
          ...updateRoomDto,
          hashtags,
          imageLocation: filename,
          lastVisited: new Date(),
        },
      },
    );

    return null;
  }

  private async findRoom(id: string): Promise<Room> {
    let room;
    try {
      room = await this.roomModel.findById(id).exec();
    } catch (error) {
      throw new NotFoundException('Could Not Find Room');
    }
    if (!room) {
      throw new NotFoundException('Could Not Find Room');
    }
    return room;
  }

  private async findHashtag(content: string): Promise<Hashtag> {
    let hashtag;
    try {
      hashtag = await this.hashtagModel.findOne({ content }).exec();
    } catch (error) {
      return null;
    }
    return hashtag;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hashtag } from './hashtag.model';
import { Room } from './room.model';

@Injectable()
export class RoomSearchService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('Hashtag') private readonly hashtagModel: Model<Hashtag>,
  ) {}

  async textSearch(textQuery, sort) {
    let rooms = [];

    switch (sort) {
      case 'latest':
        rooms = await this.roomModel
          .find()
          .or([
            { title: new RegExp(textQuery, 'i') },
            { content: new RegExp(textQuery, 'i') },
          ])
          .sort({ createdAt: -1 })
          .exec();
        break;

      case 'popularity':
        rooms = await this.roomModel
          .find()
          .or([
            { title: new RegExp(textQuery, 'i') },
            { content: new RegExp(textQuery, 'i') },
          ])
          .sort({ usersNum: -1 })
          .exec();
        rooms = rooms.filter((room) => room.usersNum < room.maxPeople);
        break;

      case 'open':
        rooms = await this.roomModel
          .find()
          .or([
            { title: new RegExp(textQuery, 'i') },
            { content: new RegExp(textQuery, 'i') },
          ])
          .sort({ createdAt: -1 })
          .exec();
        rooms = rooms.filter((room) => room.usersNum < room.maxPeople);
        break;

      default:
        rooms = await this.roomModel
          .find()
          .or([
            { title: new RegExp(textQuery, 'i') },
            { content: new RegExp(textQuery, 'i') },
          ])
          .exec();
        break;
    }

    const rankOfRooms = await this.getRanks();
    return rooms.map((roomL) => ({
      roomId: roomL._id,
      title: roomL.title,
      usersNum: roomL.usersNum,
      maxPeople: roomL.maxPeople,
      content: roomL.content,
      hashtags: roomL.hashtags,
      openKakao: roomL.openKakao,
      rank: rankOfRooms.indexOf(roomL._id.toString()) + 1,
      isOn: roomL.liveStatus,
      image: roomL.imageLocation.length ? roomL.imageLocation : null,
    }));
  }

  async hashtagSearch(hashtagQuery, sort) {
    try {
      const hashtags = await this.hashtagModel
        .find({
          content: new RegExp(hashtagQuery, 'i'),
        })
        .exec();
      //Get list of rooms from hashtagDB
      const roomList = hashtags.map((tag) => ({ rooms: tag.rooms }))[0].rooms;
      //Remove duplicate roomId
      const uniqueRoomList = [...new Set(roomList)];

      //Create & populate search result
      let rooms = [];
      for (const roomId of uniqueRoomList) {
        const foundRoom = await this.roomModel.findById(roomId);
        rooms.push(foundRoom);
      }

      switch (sort) {
        case 'latest':
          rooms = rooms.sort((a, b) => b.createdAt - a.createdAt);
          break;

        case 'popularity':
          rooms = rooms.sort((a, b) => b.usersNum - a.usersNum);
          break;

        case 'open':
          rooms = rooms.filter((room) => room.usersNum < room.maxPeople);
          break;

        default:
          break;
      }

      const rankOfRooms = await this.getRanks();
      return rooms.map((roomL) => ({
        roomId: roomL._id,
        title: roomL.title,
        usersNum: roomL.usersNum,
        maxPeople: roomL.maxPeople,
        content: roomL.content,
        hashtags: roomL.hashtags,
        openKakao: roomL.openKakao,
        rank: rankOfRooms.indexOf(roomL._id.toString()) + 1,
        isOn: roomL.liveStatus,
        image: roomL.imageLocation.length ? roomL.imageLocation : null,
      }));
    } catch (error) {
      throw new NotFoundException(
        'No room was found. Try searching with different Query',
      );
    }
  }

  private async getRanks(): Promise<string[]> {
    const rooms = await this.roomModel.find().sort({ totalStudyTime: -1 });
    const roomIdList = rooms.map((roomL) => ({
      roomId: roomL._id,
    }));
    const result = [];
    for (let i = 0; i < roomIdList.length; i++) {
      result.push(roomIdList[i].roomId.toString());
    }
    return result;
  }
}

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

    return rooms.map((roomL) => ({
      roomId: roomL._id,
      title: roomL.title,
      usersNum: roomL.usersNum,
      maxPeople: roomL.maxPeople,
      content: roomL.content,
      hashtags: roomL.hashtags,
      openKakao: roomL.openKakao,
      image: '../public/roomImages/' + roomL.imageLocation,
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

      return rooms.map((roomL) => ({
        roomId: roomL._id,
        title: roomL.title,
        usersNum: roomL.usersNum,
        maxPeople: roomL.maxPeople,
        content: roomL.content,
        hashtags: roomL.hashtags,
        openKakao: roomL.openKakao,
        image: '../public/roomImages/' + roomL.imageLocation,
      }));
    } catch (error) {
      throw new NotFoundException(
        'No room was found. Try searching with different Query',
      );
    }
  }
}

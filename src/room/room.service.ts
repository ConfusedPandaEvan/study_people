import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hashtag } from './hashtag.model';
import { Room } from './room.model';
import * as fs from 'fs';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel('Room') private readonly roomModel: Model<Room>,
    @InjectModel('Hashtag') private readonly hashtagModel: Model<Hashtag>,
  ) {}

  async getAllRooms() {
    const rooms = await this.roomModel.find().exec();

    //Need to Edit Room Mapping if needed
    return rooms.map((roomL) => ({
      title: roomL.title,
      users: roomL.users,
      content: roomL.content,
      hashtags: roomL.hashtags,
    }));
  }

  //put res here
  async leaveRoom(roomId) {
    const userId = 'dopeDude';

    const targetRoom = await this.findRoom(roomId);

    //When leaving, if the person is the only one in the room, delete room. If not, just remove the user from room
    if (targetRoom.users.length == 1) {
      this.deleteRoom(roomId);
    } else {
      await this.roomModel.updateOne(
        { _id: roomId },
        { $pull: { users: userId } },
      );
    }
  }

  //put res here
  async createRoom(file, createRoomDto) {
    // const { userId } = res.locals.user;

    //Default Image if image is not provided
    let filename = 'defaultImage.png';
    if (file) {
      filename = file.filename;
    }

    //change JSON string to Array Object
    //Check This Part ****************************************
    // const check = createRoomDto.hashtag;
    // const checkArray2 = Object.values(check);
    // console.log('a: ', checkArray);
    // console.log('at: ', typeof checkArray);
    // console.log('b: ', checkArray2);
    // console.log('bt: ', typeof checkArray2);
    const hashtags = createRoomDto.hashtag.toString()
      .replace(/\[|\]/g, '')
      .replace(/\s/g, '')
      .split(',');

    // const hashtags = JSON.parse(check);
    // console.log('hashtags', hashtags);

    //Need to delete this part after putting res for res.locals.userid
    const userId = ['dopeDude'];

    const newRoom = new this.roomModel({
      ...createRoomDto,
      hashtags,
      users: userId,
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

  async deleteRoom(roomId) {
    const targetRoom = await this.findRoom(roomId);

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
    if (targetRoom.imageLocation != 'defaultImage.png') {
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

  //put res here
  //Need to think what can go wrong with this method. - ***CreatedAt has changed, If Image is not provided it will become default image
  async updateRoom(file, roomId, updateRoomDto) {
    const targetRoom = await this.findRoom(roomId);
    const filename = targetRoom.imageLocation;

    //if new image is provided, delete original image
    if (file) {
      const filename = file.filename;
      if (targetRoom.imageLocation != 'defaultImage.png') {
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

    //recreate Hashtags
    for (let i = 0; i < updateRoomDto.hashtags.length; i++) {
      const tag = updateRoomDto.hashtags[i];
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

    await this.roomModel.updateOne(
      { _id: roomId },
      {
        $set: {
          ...updateRoomDto,
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

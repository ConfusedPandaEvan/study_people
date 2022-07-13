import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatDocument } from './chat.Schema';
@Injectable()
export class ChatsService {
  constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>){}
  async create(createChatDto: CreateChatDto) {
    const chat = new this.chatModel({
      ...createChatDto,
      createdAt: new Date()
    })
    await chat.save()
    return {chat,message:'new chat is uploaded'};
  }

  async findAll() {
    return `This action returns all chats`;
  }

  async findChatsInsideRoom(roomId: string) {
    const chats = await this.chatModel.find({roomId})
    return {chats,message:`returns all the chats inside the room #${roomId} `};
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  async remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}

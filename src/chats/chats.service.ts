import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Model } from 'mongoose';
import { ChatDocument } from './chat.Schema';
@Injectable()
export class ChatsService {
  constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>){}
  async create(createChatDto: CreateChatDto) {
    const newchat = new this.chatModel({
      ...createChatDto,
      createdAt: new Date()
    })
    return {message:'new chat message successfully added'};
  }

  findAll() {
    return `This action returns all chats`;
  }

  findOne(id: string) {
    return `This action returns a #${id} chat`;
  }

  update(id: string, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}

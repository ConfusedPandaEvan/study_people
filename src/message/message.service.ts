import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { CreateChatDto } from 'src/chats/dto/create-chat.dto';
import { Model } from 'mongoose';
import { ChatDocument } from 'src/chats/chat.Schema';

@Injectable()
export class MessageService {
  constructor(@InjectModel('Chat') private chatModel: Model<ChatDocument>){}

  create(createMessageDto: CreateMessageDto) {
    return 'This action adds a new message';
  }

  async createMessage(createChatDto:CreateChatDto) {
    const newchat = new this.chatModel({
      ...createChatDto,
      createdAt: new Date()
    })
    return {newchat, message:'new chat message successfully added'};
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}

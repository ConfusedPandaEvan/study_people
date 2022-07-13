import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { UserDocument } from 'src/users/user.Schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<UserDocument>){}
  async create(createUserDto: CreateUserDto) {
    const user = new this.userModel({
      kakakouserId:null,
      userNick:createUserDto.userNick,
      email:createUserDto.email,
      password:createUserDto.password
    })
    const createduser = await user.save();
    const userId = createduser.id as string
    return { userId, message:'new user successfully added'};
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/user.Schema';

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

  async findOne(id: string) {
    let targetUser 
    try {
      targetUser = await this.userModel.findById(id).exec();

    } catch (error) {
      throw new NotFoundException('Could Not Find User');
    }

    return {user:targetUser,message:`user information of user ${id}`};
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let updatingUser 
    try {
      updatingUser = await this.userModel.findById(id).exec();

    } catch (error) {
      throw new NotFoundException('Could Not Find User');
    }

    if (updateUserDto.email){
      await this.userModel.updateOne({_id:id},{$set: {email:updateUserDto.email}})
    }
    if (updateUserDto.password){
      await this.userModel.updateOne({_id:id},{$set: {password:updateUserDto.password}})
    }
    if (updateUserDto.userNick){
      await this.userModel.updateOne({_id:id},{$set: {userNick:updateUserDto.userNick}})
    }
  
    return {message:`${id} user information successfully updated`};
  }

  async remove(id: string) {
    let deletingUser
    try {
      deletingUser = await this.userModel.findById(id).exec();

    } catch (error) {
      throw new NotFoundException('Could Not Find User');
    }

    await this.userModel.deleteOne({ _id: id }).exec();

    return {message:`${id} user information successfully deleted`};
  }
}

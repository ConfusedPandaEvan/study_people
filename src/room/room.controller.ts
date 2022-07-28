import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Response,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { CreateRoomDto } from './dto/create-room.dto';
import { diskStorage } from 'multer';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './room.model';
import { RoomService } from './room.service';
import { GetUser } from 'src/middlewares/get-user.decorator';
import { User } from 'src/users/user.Schema';
import { RemoveUserDto } from './dto/remove-user.dto';
import { SortOrder } from 'mongoose';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  //This is only for dev purpose. This should be edited for Community Page Search
  @Get()
  async getAllRooms() {
    const rooms = await this.roomService.getAllRooms();
    return rooms;
  }

  @Get('/myrooms')
  async getMyRooms(@GetUser() userId: string) {
    const rooms = await this.roomService.getMyRooms(userId);
    return rooms;
  }

  @Get('/search')
  async textSearch(
    @Query('text') textQuery: string,
    @Query('hashtag') hashtagQuery: string,
    @Query('sort') sort: string,
  ) {
    let rooms;

    if (textQuery) {
      rooms = await this.roomService.textSearch(textQuery, sort);
    }
    if (hashtagQuery) {
      rooms = await this.roomService.hashtagSearch(hashtagQuery, sort);
    }
    if (!rooms || rooms.length == 0) {
      throw new NotFoundException(
        'No room was found. Try searching with different Query',
      );
    }
    return rooms;
  }

  @Get('/leave_room/:roomId')
  async leaveRoom(@Param('roomId') roomId: string, @GetUser() userId: string) {
    await this.roomService.leaveRoom(roomId, userId);
    return null;
  }

  @Get('/enter_room/:roomId')
  async enterRoom(
    @Param('roomId') roomId: string,
    @GetUser() userId: string,
    @Body('password') password: string,
  ) {
    return await this.roomService.enterRoom(roomId, userId, password);
  }

  @Patch('/change_owner/:roomId')
  async changeOwner(
    @Param('roomId') roomId: string,
    @Body() removeUserDto: RemoveUserDto,
    @GetUser() userId: string,
  ) {
    await this.roomService.changeOwner(roomId, removeUserDto, userId);
    return null;
  }

  @Patch('/remove_user/:roomId')
  async removeUser(
    @Param('roomId') roomId: string,
    @Body() removeUserDto: RemoveUserDto,
    @GetUser() userId: string,
  ) {
    await this.roomService.removeUser(roomId, removeUserDto, userId);
    return null;
  }

  @Get('/:roomId')
  async getRoomTitle(@Param('roomId') roomId: string) {
    const roomTitle = await this.roomService.getRoomTitle(roomId);
    return roomTitle;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/roomImages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async createRoom(
    @UploadedFile() file,
    @Body() createRoomDto: CreateRoomDto,
    @GetUser() userId: string,
  ) {
    const generatedId = await this.roomService.createRoom(
      file,
      createRoomDto,
      userId,
    );
    return { id: generatedId };
  }

  @Delete('/:roomId')
  async deleteRoom(@Param('roomId') roomId: string, @GetUser() userId: string) {
    await this.roomService.deleteRoom(roomId, userId);
    return null;
  }

  @Patch('/:roomId')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/roomImages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateRoom(
    @UploadedFile() file,
    @Param('roomId') roomId: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @GetUser() userId: string,
  ) {
    await this.roomService.updateRoom(file, roomId, updateRoomDto, userId);
    return null;
  }
}

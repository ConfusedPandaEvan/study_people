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

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  //This is only for dev purpose. This should be edited for Community Page Search
  @Get()
  async getAllRooms() {
    const rooms = await this.roomService.getAllRooms();
    return rooms;
  }

  @Get('/search')
  async textSearch(
    @Query('text') textQuery: string,
    @Query('hashtag') hashtagQuery: string,
  ) {
    let rooms;

    if (textQuery) {
      rooms = await this.roomService.textSearch(textQuery);
    }
    if (hashtagQuery) {
      rooms = await this.roomService.hashtagSearch(hashtagQuery);
    }
    if (!rooms || rooms.length == 0) {
      throw new NotFoundException(
        'No room was found. Try searching with different Query',
      );
    }
    return rooms;
  }

  // Need to get userId from Locals
  @Get('/leave_room/:roomId')
  async leaveRoom(@Param('roomId') roomId: string) {
    await this.roomService.leaveRoom(roomId);
    return null;
  }

  // Need to get userId from Locals
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
    // @Response() res,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    //put res here for createRoom
    const generatedId = await this.roomService.createRoom(file, createRoomDto);
    return { id: generatedId };
  }

  @Delete('/:roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    await this.roomService.deleteRoom(roomId);
    return null;
  }

  // Need to get userId from Locals
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
  ) {
    await this.roomService.updateRoom(file, roomId, updateRoomDto);
    return null;
  }
}

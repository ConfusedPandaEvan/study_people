import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

  //Create Room
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

  @Patch()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/roomImages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async updateRoom(@UploadedFile() file, @Body() updateRoomDto: UpdateRoomDto) {
    const generatedId = await this.roomService.createRoom(file, updateRoomDto);
    return { id: generatedId };
  }

  @Delete('/:roomId')
  async deleteRoom(@Param('roomId') roomId: string) {
    await this.roomService.deleteRoom(roomId);
    return null;
  }
}

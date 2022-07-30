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
  Req,
  Response,
  UploadedFile,
  UseGuards,
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
import { RoomSearchService } from './roomSearch.service';
import { ControllerAuthGuard } from 'src/auth/controllerauth.guard';
import { RequestWithAuth } from 'src/types';

@Controller('room')
export class RoomController {
  constructor(
    private readonly roomService: RoomService,
    private readonly roomSearchService: RoomSearchService,
  ) {}

  //This is only for dev purpose. This should be edited for Community Page Search
  @Get()
  async getAllRooms(@Query('sort') sort: string) {
    const rooms = await this.roomService.getAllRooms(sort);
    return rooms;
  }

  @UseGuards(ControllerAuthGuard)
  @Get('/myrooms')
  async getMyRooms(@Req() request: RequestWithAuth) {
    const { userId } = request;
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
      rooms = await this.roomSearchService.textSearch(textQuery, sort);
    }
    if (hashtagQuery) {
      rooms = await this.roomSearchService.hashtagSearch(hashtagQuery, sort);
    }
    if (!rooms || rooms.length == 0) {
      throw new NotFoundException(
        'No room was found. Try searching with different Query',
      );
    }
    return rooms;
  }

  @UseGuards(ControllerAuthGuard)
  @Get('/leave_room/:roomId')
  async leaveRoom(
    @Param('roomId') roomId: string,
    @Req() request: RequestWithAuth,
  ) {
    const { userId } = request;
    await this.roomService.leaveRoom(roomId, userId);
    return null;
  }

  @UseGuards(ControllerAuthGuard)
  @Get('/enter_room/:roomId')
  async enterRoom(
    @Param('roomId') roomId: string,
    @Req() request: RequestWithAuth,
    // @Body('password') password: string,
  ) {
    const { userId } = request;
    return await this.roomService.enterRoom(roomId, userId);
    // return await this.roomService.enterRoom(roomId, userId, password);
  }

  @UseGuards(ControllerAuthGuard)
  @Patch('/change_owner/:roomId')
  async changeOwner(
    @Param('roomId') roomId: string,
    @Body() removeUserDto: RemoveUserDto,
    @Req() request: RequestWithAuth,
  ) {
    const { userId } = request;
    await this.roomService.changeOwner(roomId, removeUserDto, userId);
    return null;
  }

  @UseGuards(ControllerAuthGuard)
  @Patch('/remove_user/:roomId')
  async removeUser(
    @Param('roomId') roomId: string,
    @Body() removeUserDto: RemoveUserDto,
    @Req() request: RequestWithAuth,
  ) {
    const { userId } = request;
    await this.roomService.removeUser(roomId, removeUserDto, userId);
    return null;
  }

  @Get('/:roomId')
  async getRoomTitle(@Param('roomId') roomId: string) {
    const roomTitle = await this.roomService.getRoomTitle(roomId);
    return roomTitle;
  }

  @UseGuards(ControllerAuthGuard)
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
    @Req() request: RequestWithAuth,
  ) {
    const { userId } = request;
    const generatedId = await this.roomService.createRoom(
      file,
      createRoomDto,
      userId,
    );
    return { id: generatedId };
  }

  @UseGuards(ControllerAuthGuard)
  @Delete('/:roomId')
  async deleteRoom(
    @Param('roomId') roomId: string,
    @Req() request: RequestWithAuth,
  ) {
    const { userId } = request;
    await this.roomService.deleteRoom(roomId, userId);
    return null;
  }

  @UseGuards(ControllerAuthGuard)
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
    @Req() request: RequestWithAuth,
  ) {
    const { userId } = request;
    await this.roomService.updateRoom(file, roomId, updateRoomDto, userId);
    return null;
  }
}

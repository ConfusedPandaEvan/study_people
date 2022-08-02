import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { diskStorage } from 'multer';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from 'src/utils/file-uploading.utils';
import { ControllerAuthGuard } from 'src/auth/controllerauth.guard';
import { RequestWithAuth } from 'src/types';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @UseGuards(ControllerAuthGuard)
  @Get()
  findOne(@Req() request: RequestWithAuth) {
    const { userId } = request;
    return this.usersService.findOne(userId);
  }

  @UseGuards(ControllerAuthGuard)
  @Patch()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './public/profileImages',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async update(
    @UploadedFile() file,
    @Req() request: RequestWithAuth,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { userId } = request;
    return this.usersService.update(file, userId, updateUserDto);
  }

  @UseGuards(ControllerAuthGuard)
  @Delete('/:userId')
  async remove(
    @Param('userId') userId: string,
    @Req() request: RequestWithAuth,
  ) {
    await this.usersService.remove(userId);
    return;
  }
}

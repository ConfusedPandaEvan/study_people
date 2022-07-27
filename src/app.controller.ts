import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { GetUser } from './middlewares/get-user.decorator';
import { RoomService } from './room/room.service';
import { TodoListService } from './todo-list/todo-list.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly roomService: RoomService,
    private readonly todoListService: TodoListService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/.well-known/pki-validation/724F5E422FBC3D01831016D700674821.txt')
  wellknown(@Res() res: any) {
    res.sendFile(
      __dirname +
        '/.well-known/pki-validation/724F5E422FBC3D01831016D700674821.txt',
    );
  }
  @Get('/main')
  async getMainPage(@GetUser() userId: string) {
    const rooms = await this.roomService.getMyRooms(userId);
    const todoLists = await this.todoListService.getAllTodoLists(userId);
    return [rooms, todoLists];
  }
}

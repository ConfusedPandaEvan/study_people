import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoListDto } from './create-todo-list.dto';

export class UpdateTodoListDto extends PartialType(CreateTodoListDto) {}

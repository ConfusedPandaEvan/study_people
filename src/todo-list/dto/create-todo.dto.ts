import { IsNotEmpty, IsString } from 'class-validator';
import { Todo } from '../todo.model';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  readonly categoryTitle: string;

  readonly todoItem: { id: string; content: string }[] = [];
}

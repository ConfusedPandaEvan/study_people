import { IsNotEmpty } from 'class-validator';

export class DeleteTodoListDto {
  @IsNotEmpty()
  readonly targetTodoList: string[] = [];
}

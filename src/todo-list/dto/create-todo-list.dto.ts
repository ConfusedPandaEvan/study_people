import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTodoListDto {
  @IsNotEmpty()
  @IsString()
  readonly userId: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;
}

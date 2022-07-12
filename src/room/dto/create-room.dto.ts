import {
  Contains,
  IsInt,
  IsNotEmpty,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(9)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(71)
  readonly content: string;

  //this part may also change for 4digit number
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(4)
  readonly password: string;

  // @IsString()
  readonly hashtag: string[] = [];

  @IsNotEmpty()
  @IsString()
  @Contains('open.kakao.com')
  readonly openKakao: string;

  @IsNotEmpty()
  // @IsInt()
  // @Min(2)
  // @Max(5)
  readonly maxPeople: number;
}

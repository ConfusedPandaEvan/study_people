import {
  Contains,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
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
  @MaxLength(5)
  readonly password: string;

  @IsString({ each: true })
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

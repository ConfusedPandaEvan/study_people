import {
  Contains,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;

  @IsString({ each: true })
  readonly hashtag: string[] = [];

  @IsNotEmpty()
  @IsString()
  @Contains('open.kakao.com')
  readonly openKakao: string;

  @IsNotEmpty()
  // @IsNumber()
  // @Min(2)
  // @Max(5)
  readonly maxPeople: number;
}

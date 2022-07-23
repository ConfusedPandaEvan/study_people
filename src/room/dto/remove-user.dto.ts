import { IsNotEmpty, IsString } from "class-validator";

export class RemoveUserDto {
    @IsNotEmpty()
    @IsString()
    readonly targetId: string;
}
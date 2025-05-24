import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateFriendRequestDto {
  @ApiProperty()
  @IsUUID()
  receiverId: string;
}

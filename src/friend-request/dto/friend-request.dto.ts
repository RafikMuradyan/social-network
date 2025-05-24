import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from '../enums/friend-request-status.enum';
import { FriendRequestRaw } from '../interfaces/friend-request-raw.interface';

export class FriendRequestDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty({
    enum: FriendRequestStatus,
  })
  status: FriendRequestStatus;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(raw: FriendRequestRaw) {
    this.id = raw.id;
    this.senderId = raw.sender_id;
    this.receiverId = raw.receiver_id;
    this.status = raw.status;
    this.createdAt = raw.created_at;
    this.updatedAt = raw.updated_at;
  }
}

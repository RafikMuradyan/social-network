import { Module } from '@nestjs/common';
import { FriendRequestController } from './friend-request.controller';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestRepository } from './friend-request.repository';

@Module({
  controllers: [FriendRequestController],
  providers: [FriendRequestService, FriendRequestRepository],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}

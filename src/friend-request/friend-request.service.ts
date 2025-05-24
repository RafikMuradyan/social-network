import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequestRepository } from './friend-request.repository';
import { FriendRequestStatus } from './enums/friend-request-status.enum';
import { FriendRequestDto } from './dto/friend-request.dto';

@Injectable()
export class FriendRequestService {
  constructor(
    private readonly friendRequestRepository: FriendRequestRepository,
  ) { }

  async sendFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequestDto> {
    await this.validateFriendRequest(senderId, receiverId);

    const friendRequest =
      await this.friendRequestRepository.createFriendRequest(
        senderId,
        receiverId,
      );

    return new FriendRequestDto(friendRequest);
  }

  async acceptFriendRequest(requestId: string): Promise<FriendRequestDto> {
    const friendRequest =
      await this.friendRequestRepository.updateFriendRequestStatus(
        requestId,
        FriendRequestStatus.ACCEPTED,
      );
    if (!friendRequest) {
      throw new NotFoundException('friend request not found');
    }

    return new FriendRequestDto(friendRequest);
  }

  async declineFriendRequest(requestId: string): Promise<void> {
    await this.friendRequestRepository.deleteFriendRequest(requestId);
  }

  async getPendingRequests(userId: string): Promise<FriendRequestDto[]> {
    const friendRequests =
      await this.friendRequestRepository.getFriendRequests(userId);

    return friendRequests.map((request) => new FriendRequestDto(request));
  }

  async validateFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    if (senderId === receiverId) {
      throw new BadRequestException('cannot send friend request to yourself');
    }

    const currentRequest =
      await this.friendRequestRepository.checkCurrentRequestStatus(
        senderId,
        receiverId,
      );

    if (currentRequest) {
      if (currentRequest.status === FriendRequestStatus.ACCEPTED) {
        throw new BadRequestException('friend request already accepted');
      } else {
        if (currentRequest?.senderId === senderId) {
          throw new BadRequestException('friend request already sent');
        }

        if (currentRequest?.senderId === receiverId) {
          throw new BadRequestException(
            'you already have pending friend request',
          );
        }
      }
    }
  }
}

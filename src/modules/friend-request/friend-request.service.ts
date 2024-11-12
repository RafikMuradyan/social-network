import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendRequestEntity } from './friend-request.entity';
import { FriendRequestStatus } from './enums';
import { UserService } from '../user/user.service';
import {
  AlreadyFriendsException,
  CantRequestToSelfException,
  FriendRequestExsistsException,
  FriendRequestNotFoundException,
} from './exceptions';
import { PageDto, PageMetaDto, PageOptionsDto } from '../../common';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequestEntity)
    private friendRequestRepository: Repository<FriendRequestEntity>,
    private userService: UserService,
  ) {}

  async sendRequest(
    senderId: number,
    receiverId: number,
  ): Promise<FriendRequestEntity> {
    if (senderId === receiverId) {
      throw new CantRequestToSelfException();
    }

    const receiver = await this.userService.findById(receiverId);

    const existingRequest = await this.friendRequestRepository.findOne({
      where: [
        { sender: { id: senderId }, receiver: { id: receiver.id } },
        { sender: { id: receiver.id }, receiver: { id: senderId } },
      ],
    });

    if (existingRequest) {
      switch (existingRequest.status) {
        case FriendRequestStatus.ACCEPTED:
          throw new AlreadyFriendsException();

        case FriendRequestStatus.PENDING:
          throw new FriendRequestExsistsException();

        default:
          break;
      }
    }

    const friendRequest = this.friendRequestRepository.create({
      sender: { id: senderId },
      receiver: { id: receiverId },
      status: FriendRequestStatus.PENDING,
    });

    const createdRequest =
      await this.friendRequestRepository.save(friendRequest);

    return plainToInstance(FriendRequestEntity, createdRequest);
  }

  async getReceivedRequests(
    userId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FriendRequestEntity>> {
    const [requests, totalCount] =
      await this.friendRequestRepository.findAndCount({
        where: {
          receiver: { id: userId },
          status: FriendRequestStatus.PENDING,
        },
        relations: ['sender'],
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
        order: {
          createdAt: pageOptionsDto.order,
        },
      });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(
      plainToInstance(FriendRequestEntity, requests),
      pageMetaDto,
    );
  }

  async getSentRequests(
    userId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FriendRequestEntity>> {
    const [requests, totalCount] =
      await this.friendRequestRepository.findAndCount({
        where: {
          sender: { id: userId },
          status: FriendRequestStatus.PENDING,
        },
        relations: ['receiver'],
        skip: pageOptionsDto.skip,
        take: pageOptionsDto.take,
      });

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(
      plainToInstance(FriendRequestEntity, requests),
      pageMetaDto,
    );
  }

  async acceptRequest(
    requestId: number,
    userId: number,
  ): Promise<FriendRequestEntity> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: userId } },
    });

    if (!request || request.status !== FriendRequestStatus.PENDING) {
      throw new FriendRequestNotFoundException();
    }

    request.status = FriendRequestStatus.ACCEPTED;
    const savedRequest = await this.friendRequestRepository.save(request);

    return plainToInstance(FriendRequestEntity, savedRequest);
  }

  async declineRequest(
    requestId: number,
    userId: number,
  ): Promise<FriendRequestEntity> {
    const request = await this.friendRequestRepository.findOne({
      where: { id: requestId, receiver: { id: userId } },
    });

    if (!request || request.status !== FriendRequestStatus.PENDING) {
      throw new FriendRequestNotFoundException();
    }

    request.status = FriendRequestStatus.DECLINED;
    const savedRequest = await this.friendRequestRepository.save(request);

    return plainToInstance(FriendRequestEntity, savedRequest);
  }
}

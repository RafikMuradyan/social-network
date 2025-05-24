import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FriendRequestDto } from './dto/friend-request.dto';
import { UserDto } from '../users/dto/user.dto';

@ApiTags('friend-requests')
@ApiBearerAuth()
@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @ApiCreatedResponse({
    type: FriendRequestDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendRequest(
    @Body() dto: CreateFriendRequestDto,
    @CurrentUser() user: UserDto,
  ): Promise<FriendRequestDto> {
    return this.friendRequestService.sendFriendRequest(user.id, dto.receiverId);
  }

  @ApiOkResponse({
    type: FriendRequestDto,
  })
  @Post(':requestId/accept')
  @HttpCode(HttpStatus.OK)
  async acceptRequest(
    @Param('requestId') requestId: string,
  ): Promise<FriendRequestDto> {
    return this.friendRequestService.acceptFriendRequest(requestId);
  }

  @ApiNoContentResponse()
  @Post(':requestId/decline')
  @HttpCode(HttpStatus.NO_CONTENT)
  async declineRequest(@Param('requestId') requestId: string): Promise<void> {
    return this.friendRequestService.declineFriendRequest(requestId);
  }

  @ApiOkResponse({
    type: [FriendRequestDto],
  })
  @Get()
  async getPendingRequests(
    @CurrentUser() user: UserDto,
  ): Promise<FriendRequestDto[]> {
    return this.friendRequestService.getPendingRequests(user.id);
  }
}

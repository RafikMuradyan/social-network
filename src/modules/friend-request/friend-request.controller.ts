import {
  Controller,
  Post,
  Get,
  Param,
  UseGuards,
  Req,
  Patch,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto, PageOptionsDto, IRequestWithUser } from '../../common';
import { FriendRequestEntity } from './friend-request.entity';

@ApiTags('Friend Requests')
@ApiBearerAuth()
@Controller('friend-requests')
@UseGuards(JwtAuthGuard)
export class FriendRequestController {
  constructor(private friendRequestService: FriendRequestService) {}

  @Post('send/:receiverId')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'send friend request' })
  async sendRequest(
    @Req() req: IRequestWithUser,
    @Param('receiverId') receiverId: number,
  ): Promise<FriendRequestEntity> {
    return this.friendRequestService.sendRequest(req.user.id, receiverId);
  }

  @Get('received')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'get all received requests' })
  async getReceivedRequests(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FriendRequestEntity>> {
    return this.friendRequestService.getReceivedRequests(
      req.user.id,
      pageOptionsDto,
    );
  }

  @Get('sent')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'get all sent requests' })
  async getSentRequests(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<FriendRequestEntity>> {
    return this.friendRequestService.getSentRequests(
      req.user.id,
      pageOptionsDto,
    );
  }

  @Patch('accept/:requestId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'accept friend request' })
  async acceptRequest(
    @Req() req: IRequestWithUser,
    @Param('requestId') requestId: number,
  ): Promise<FriendRequestEntity> {
    return this.friendRequestService.acceptRequest(requestId, req.user.id);
  }

  @Patch('decline/:requestId')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse({ description: 'decline friend request' })
  async declineRequest(
    @Req() req: IRequestWithUser,
    @Param('requestId') requestId: number,
  ): Promise<FriendRequestEntity> {
    return this.friendRequestService.declineRequest(requestId, req.user.id);
  }
}

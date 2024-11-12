import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto, IRequestWithUser } from '../../common';
import { UserEntity } from './user.entity';
import { UserSearchOptionsDto } from './dtos';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'search user' })
  async searchUsers(
    @Req() req: IRequestWithUser,
    @Query() userSearchOptions: UserSearchOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const currentUserId = req.user.id;
    return this.userService.searchUsers(currentUserId, userSearchOptions);
  }

  @Get('friends')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'get friends' })
  async getFriends(
    @Req() req: IRequestWithUser,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const currentUserId = req.user.id;
    return this.userService.getFriends(currentUserId, pageOptionsDto);
  }
}

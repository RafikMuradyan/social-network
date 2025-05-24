import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { SearchUsersDto } from './dto/search-users.dto';
import { UserDto } from './dto/user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    type: UserDto,
  })
  @Get()
  async searchUsers(
    @Query() searchParams: SearchUsersDto,
    @CurrentUser() user: UserDto,
  ): Promise<UserDto[]> {
    return this.usersService.searchUsers(searchParams, user.id);
  }
}

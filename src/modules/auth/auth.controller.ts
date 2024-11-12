import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos';
import { ILoginResponse } from './interfaces';
import { UserService } from '../user/user.service';
import { ChangePasswordDto, CreateUserDto } from '../user/dtos';
import { JwtAuthGuard } from './guards';
import { IRequestWithUser } from '../../common';
import { UserUnauthorizedException } from './exceptions';
import { UserEntity } from '../user/user.entity';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'user login' })
  async login(@Body() loginDto: LoginDto): Promise<ILoginResponse> {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    if (!user) {
      throw new UserUnauthorizedException();
    }

    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
    };

    const accessToken = await this.authService.login(payload);

    return {
      success: true,
      accessToken,
    };
  }

  @Post('registration')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'user registration' })
  async registration(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserEntity> {
    const createdUser = this.userService.registration(createUserDto);

    return createdUser;
  }

  @Post('change-password')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: "change users' password" })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: IRequestWithUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<Partial<UserEntity>> {
    await changePasswordDto.validate();
    const userId = req.user.id;

    return this.userService.changePassword(userId, changePasswordDto);
  }
}

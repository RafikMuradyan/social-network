import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { AuthResponseDto } from './dto/auth-response.dto';
import { UserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.usersService.findForAuth(registerDto.email);

    if (existingUser) {
      throw new ConflictException('user already exists');
    }

    const user = await this.usersService.createUser(registerDto);
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return new AuthResponseDto(user, token);
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.usersService.findForAuth(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    const userDto = new UserDto(user);

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return new AuthResponseDto(userDto, token);
  }
}

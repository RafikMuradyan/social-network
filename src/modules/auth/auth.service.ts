import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ITokenPayload } from './interfaces';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  private async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async login(user: ITokenPayload): Promise<string> {
    return this.jwtService.sign(user);
  }

  async validateUser(
    username: string,
    password: string,
  ): Promise<ITokenPayload> {
    const user = await this.userService.findByUsername(username);

    if (user && (await this.comparePasswords(password, user.password))) {
      const { ...result } = user;
      return result;
    }

    return null;
  }
}

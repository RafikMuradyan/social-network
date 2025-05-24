import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class AuthResponseDto {
  @ApiProperty({ type: UserDto })
  user: UserDto;

  @ApiProperty()
  token: string;

  constructor(user: UserDto, token: string) {
    this.user = user;
    this.token = token;
  }
}

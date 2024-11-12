import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The unique username of the user',
    example: 'john123',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'The password for the user',
    example: 'P@ssw0rd',
  })
  @IsNotEmpty()
  password: string;
}

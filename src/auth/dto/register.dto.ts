import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsString, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  birthDate: Date;
}

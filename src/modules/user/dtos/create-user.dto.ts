import {
  IsString,
  IsInt,
  IsNotEmpty,
  Min,
  IsStrongPassword,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The unique username of the user',
    example: 'john123',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The age of the user', example: 44 })
  @IsInt()
  @Min(16)
  @Max(116)
  @IsNotEmpty()
  age: number;

  @ApiProperty({
    description: 'The password for the user',
    example: 'P@ssw0rd',
  })
  @IsStrongPassword({
    minLength: 6,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}

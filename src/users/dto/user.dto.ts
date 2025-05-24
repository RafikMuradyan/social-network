import { ApiProperty } from '@nestjs/swagger';
import { UserRow } from '../interfaces/user-row.interface';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  @ApiProperty({ type: Date })
  birthDate: Date;

  constructor(user: UserRow) {
    this.id = user.id;
    this.firstName = user.first_name;
    this.lastName = user.last_name;
    this.email = user.email;
    this.createdAt = user.created_at;
    this.updatedAt = user.updated_at;
    this.birthDate = user.birth_date;
  }
}

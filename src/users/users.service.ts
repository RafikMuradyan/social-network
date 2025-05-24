import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, SearchUsersDto } from './dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UserRow } from './interfaces/user-row.interface';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async createUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    const userRow = await this.usersRepository.create(
      createUserDto,
      passwordHash,
    );
    return new UserDto(userRow);
  }

  public async searchUsers(
    searchParams: SearchUsersDto,
    currentUserId: string,
  ): Promise<UserDto[]> {
    const userRows = await this.usersRepository.search(
      searchParams,
      currentUserId,
    );
    return userRows.map((userRow) => new UserDto(userRow));
  }

  public async getUserById(id: string): Promise<UserDto> {
    const userRow = await this.usersRepository.findById(id);
    return new UserDto(userRow);
  }

  public async findForAuth(email: string): Promise<UserRow | null> {
    const userRow = await this.usersRepository.findByEmail(email);
    return userRow;
  }
}

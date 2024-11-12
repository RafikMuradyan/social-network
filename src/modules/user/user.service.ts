import { hash, compare } from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import {
  Between,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Raw,
  Repository,
} from 'typeorm';
import { UserNotFoundException } from './exceptions';
import { ChangePasswordDto, CreateUserDto, UserSearchOptionsDto } from './dtos';
import { IncorrectPasswordException } from '../auth/exceptions';
import { plainToInstance } from 'class-transformer';
import { UserAlreadyExistsException } from './exceptions';
import { PageOptionsDto, PageDto, PageMetaDto } from '../../common';
import { FriendRequestStatus } from '../friend-request/enums';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findById(id: number): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOneBy({ id });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return existingUser;
  }

  async findByUsername(username: string): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    return existingUser;
  }

  async findByUsernameOrFail(username: string): Promise<UserEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });

    if (!existingUser) {
      throw new UserNotFoundException();
    }

    return plainToInstance(UserEntity, existingUser);
  }

  async registration(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existingUser = await this.findByUsername(createUserDto.username);
    if (existingUser) {
      throw new UserAlreadyExistsException();
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(newUser);

    return plainToInstance(UserEntity, savedUser);
  }

  async changePassword(
    id: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<Partial<UserEntity>> {
    const user = await this.findById(id);

    const isMatch = await compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isMatch) {
      throw new IncorrectPasswordException();
    }

    const hashedNewPassword = await hash(changePasswordDto.newPassword, 10);
    user.password = hashedNewPassword;

    const updatedUser = await this.userRepository.save(user);

    return plainToInstance(UserEntity, updatedUser);
  }

  async searchUsers(
    currentUserId: number,
    searchParams: UserSearchOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const { searchTerm, minAge, maxAge } = searchParams;
    const where: FindOptionsWhere<UserEntity> = {};

    where.id = Not(currentUserId);

    if (searchTerm) {
      const search = `%${searchTerm}%`;
      where.username = Raw((alias) => `${alias} ILIKE :search`, { search });
    }

    if (minAge && maxAge) {
      where.age = Between(minAge, maxAge);
    } else if (minAge) {
      where.age = MoreThanOrEqual(minAge);
    } else if (maxAge) {
      where.age = LessThanOrEqual(maxAge);
    }

    const [users, totalCount] = await this.userRepository.findAndCount({
      where,
      skip: searchParams.skip,
      take: searchParams.take,
    });

    const pageMetaDto = new PageMetaDto({
      totalCount,
      pageOptionsDto: searchParams,
    });

    return new PageDto(plainToInstance(UserEntity, users), pageMetaDto);
  }

  async getFriends(
    userId: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserEntity>> {
    const [friends, totalCount] = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin(
        'friend_requests',
        'sentRequests',
        'sentRequests.sender_id = user.id',
      )
      .leftJoin(
        'friend_requests',
        'receivedRequests',
        'receivedRequests.receiver_id = user.id',
      )
      .where(
        `(sentRequests.receiver_id = :userId AND sentRequests.status = :status) OR 
          (receivedRequests.sender_id = :userId AND receivedRequests.status = :status)`,
        { userId, status: FriendRequestStatus.ACCEPTED },
      )
      .getManyAndCount();

    const pageMetaDto = new PageMetaDto({ totalCount, pageOptionsDto });

    return new PageDto(plainToInstance(UserEntity, friends), pageMetaDto);
  }
}

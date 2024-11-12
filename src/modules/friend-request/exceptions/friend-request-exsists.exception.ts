import { ConflictException } from '@nestjs/common';

export class FriendRequestExsistsException extends ConflictException {
  constructor() {
    super('errors.friendRequestExsists');
  }
}

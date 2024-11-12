import { ConflictException } from '@nestjs/common';

export class AlreadyFriendsException extends ConflictException {
  constructor() {
    super('errors.alreadyFriends');
  }
}

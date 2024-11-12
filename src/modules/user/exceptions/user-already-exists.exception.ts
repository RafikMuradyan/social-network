import { ConflictException } from '@nestjs/common';

export class UserAlreadyExistsException extends ConflictException {
  constructor() {
    super('errors.userAlreadyExists');
  }
}

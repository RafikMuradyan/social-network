import { ConflictException } from '@nestjs/common';

export class UserAlreadyExsistsException extends ConflictException {
  constructor() {
    super('errors.userAlreadyExsits');
  }
}

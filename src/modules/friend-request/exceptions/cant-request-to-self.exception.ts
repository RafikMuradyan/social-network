import { BadRequestException } from '@nestjs/common';

export class CantRequestToSelfException extends BadRequestException {
  constructor() {
    super('errors.cantRequestToSelf');
  }
}

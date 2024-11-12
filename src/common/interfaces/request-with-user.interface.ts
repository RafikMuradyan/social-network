import { Request } from 'express';
import { IUserData } from '../../modules/auth/interfaces';

export interface IRequestWithUser extends Request {
  user: IUserData;
}

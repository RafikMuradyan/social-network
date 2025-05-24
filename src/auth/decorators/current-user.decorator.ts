import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from '../../users/dto/user.dto';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: UserDto }>();

    const user = request.user;

    return user;
  },
);

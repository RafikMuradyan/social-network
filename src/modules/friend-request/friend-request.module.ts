import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendRequestEntity } from './friend-request.entity';
import { FriendRequestService } from './friend-request.service';
import { UserModule } from '../user/user.module';
import { FriendRequestController } from './friend-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FriendRequestEntity]), UserModule],
  controllers: [FriendRequestController],
  providers: [FriendRequestService],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}

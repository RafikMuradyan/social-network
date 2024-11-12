import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { FriendRequestStatus } from './enums';
import { AbstractEntity } from '../../common';

@Entity('friend_requests')
export class FriendRequestEntity extends AbstractEntity {
  @ManyToOne(() => UserEntity, (user) => user.sentRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver: UserEntity;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}

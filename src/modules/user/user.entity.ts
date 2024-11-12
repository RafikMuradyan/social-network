import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../common';
import { Exclude } from 'class-transformer';
import { FriendRequestEntity } from '../friend-request/friend-request.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ nullable: false, type: 'varchar' })
  name!: string;

  @Column({ nullable: false, type: 'smallint' })
  age!: number;

  @Column({ unique: true, nullable: false, type: 'varchar' })
  username!: string;

  @Column({ nullable: false, type: 'varchar' })
  @Exclude()
  password!: string;

  @OneToMany(() => FriendRequestEntity, (request) => request.sender)
  sentRequests: FriendRequestEntity[];

  @OneToMany(() => FriendRequestEntity, (request) => request.receiver)
  receivedRequests: FriendRequestEntity[];
}

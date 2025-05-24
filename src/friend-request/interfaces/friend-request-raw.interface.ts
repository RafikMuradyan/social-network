import { FriendRequestStatus } from '../enums/friend-request-status.enum';

export interface FriendRequestRaw {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: FriendRequestStatus;
  created_at: Date;
  updated_at: Date;
}

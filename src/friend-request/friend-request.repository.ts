import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { FriendRequestStatus } from './enums/friend-request-status.enum';
import { FriendRequestRaw } from './interfaces/friend-request-raw.interface';

@Injectable()
export class FriendRequestRepository {
  constructor(
    @Inject(Pool)
    private readonly pool: Pool,
  ) {}

  async createFriendRequest(
    senderId: string,
    receiverId: string,
  ): Promise<FriendRequestRaw> {
    const query = `
      INSERT INTO friend_requests (sender_id, receiver_id, status)
      VALUES ($1, $2, $3)
      RETURNING id, sender_id, receiver_id, status, created_at, updated_at
    `;

    const result = await this.pool.query<FriendRequestRaw>(query, [
      senderId,
      receiverId,
      FriendRequestStatus.PENDING,
    ]);
    return result.rows[0];
  }

  async updateFriendRequestStatus(
    requestId: string,
    status: FriendRequestStatus,
  ): Promise<FriendRequestRaw | null> {
    const query = `
      UPDATE friend_requests
      SET status = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id, sender_id, receiver_id, status, created_at, updated_at
    `;

    const result = await this.pool.query<FriendRequestRaw>(query, [
      requestId,
      status,
    ]);
    return result.rows[0] || null;
  }

  async deleteFriendRequest(requestId: string): Promise<void> {
    const query = `
      DELETE FROM friend_requests WHERE id = $1
    `;
    await this.pool.query(query, [requestId]);
  }

  async getFriendRequests(userId: string): Promise<FriendRequestRaw[]> {
    const query = `
      SELECT id, sender_id, receiver_id, status, created_at, updated_at
      FROM friend_requests
      WHERE receiver_id = $1 AND status = $2
    `;

    const result = await this.pool.query<FriendRequestRaw>(query, [
      userId,
      FriendRequestStatus.PENDING,
    ]);
    return result.rows;
  }

  async checkCurrentRequestStatus(
    senderId: string,
    receiverId: string,
  ): Promise<{
    status: FriendRequestStatus;
    senderId: string;
    receiverId: string;
  } | null> {
    const query = `
      SELECT status, sender_id, receiver_id
      FROM friend_requests 
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
    `;

    const result = await this.pool.query<FriendRequestRaw>(query, [
      senderId,
      receiverId,
    ]);
    const row = result.rows[0];
    return row
      ? {
          status: row.status,
          senderId: row.sender_id,
          receiverId: row.receiver_id,
        }
      : null;
  }
}

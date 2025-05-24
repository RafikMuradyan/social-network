import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import { CreateUserDto, SearchUsersDto } from './dto';
import { UserRow } from './interfaces/user-row.interface';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(Pool)
    private readonly pool: Pool,
  ) {}

  public async create(
    createUserDto: CreateUserDto,
    passwordHash: string,
  ): Promise<UserRow> {
    const query = `
      INSERT INTO users (first_name, last_name, email, password_hash, birth_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, first_name, last_name, email, birth_date, created_at, updated_at
    `;

    const values = [
      createUserDto.firstName,
      createUserDto.lastName,
      createUserDto.email,
      passwordHash,
      createUserDto.birthDate,
    ];

    const result = await this.pool.query<UserRow>(query, values);
    return result.rows[0];
  }

  public async search(
    params: SearchUsersDto,
    currentUserId: string,
  ): Promise<UserRow[]> {
    const conditions: string[] = [];

    conditions.push(`users.id != '${currentUserId}'`);

    if (params.firstName) {
      conditions.push(`first_name ILIKE '%${params.firstName}%'`);
    }

    if (params.lastName) {
      conditions.push(`last_name ILIKE '%${params.lastName}%'`);
    }

    if (params.minAge) {
      conditions.push(`date_part('year', age(birth_date)) >= ${params.minAge}`);
    }

    if (params.maxAge) {
      conditions.push(`date_part('year', age(birth_date)) <= ${params.maxAge}`);
    }

    const query = `
      SELECT id, first_name, last_name, email, birth_date, created_at, updated_at
      FROM users
      WHERE ${conditions.join(' AND ')}
    `;

    const result = await this.pool.query<UserRow>(query);
    return result.rows;
  }

  public async findById(id: string): Promise<UserRow> {
    const query = `
      SELECT id, first_name, last_name, email, created_at, birth_date, updated_at
      FROM users
      WHERE id = $1
    `;

    const result: QueryResult<UserRow> = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  public async findByEmail(email: string): Promise<UserRow | null> {
    const query = `
      SELECT id, first_name, last_name, email, created_at, password_hash, birth_date, updated_at
      FROM users
      WHERE email = $1
    `;

    const result: QueryResult<UserRow> = await this.pool.query(query, [email]);
    return result.rows[0] || null;
  }
}

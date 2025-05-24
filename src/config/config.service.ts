import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    dotenv.config();
    this.envConfig = {
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_PORT: process.env.DB_PORT || '5432',
      DB_USER: process.env.DB_USER || 'postgres',
      DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
      DB_NAME: process.env.DB_NAME || 'social_network',
      JWT_SECRET: process.env.JWT_SECRET || 'super-secret',
      PORT: process.env.PORT || '3000',
    };
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  get dbConfig() {
    return {
      host: this.get('DB_HOST'),
      port: parseInt(this.get('DB_PORT'), 10),
      user: this.get('DB_USER'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
      ssl: { rejectUnauthorized: false },
    };
  }

  get jwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  get port(): number {
    return parseInt(this.get('PORT'), 10);
  }
}

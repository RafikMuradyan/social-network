// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();
import { DataSource, DataSourceOptions } from 'typeorm';
import { databaseConfigSchema } from '../src/utils';
import { UserEntity } from '../src/modules/user/user.entity';
import { FriendRequestEntity } from '../src/modules/friend-request/friend-request.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: false }
      : undefined,
  synchronize: false,
  entities: [UserEntity, FriendRequestEntity],
  migrations: ['dist/database/migrations/*.js'],
  subscribers: [],
};

const { error } = databaseConfigSchema.validate(dataSourceOptions);

if (error) throw new Error(`Invalid database configuration: ${error.message}`);

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

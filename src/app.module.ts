import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../database/ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { FriendRequestModule } from './modules/friend-request/friend-request.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UserModule,
    FriendRequestModule,
  ],
})
export class AppModule {}

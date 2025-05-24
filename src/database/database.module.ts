import { Global, Module } from '@nestjs/common';
import { Pool } from 'pg';
import { ConfigService } from '../config/config.service';

const databasePoolFactory = {
  provide: Pool,
  useFactory: (configService: ConfigService) => {
    return new Pool(configService.dbConfig);
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [databasePoolFactory],
  exports: [Pool],
})
export class DatabaseModule {}

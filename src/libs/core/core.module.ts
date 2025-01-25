import { Global, Module } from '@nestjs/common';
import { DatabaseModule } from './db/database.module';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
})
export class CoreModule {}

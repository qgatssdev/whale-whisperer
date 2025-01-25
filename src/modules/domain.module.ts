import { Module } from '@nestjs/common';
import { CoreModule } from 'src/libs/core/core.module';
import { BlockchainModule } from './blockchain/blockchain.module';

@Module({
  imports: [CoreModule, BlockchainModule],
})
export class DomainModule {}

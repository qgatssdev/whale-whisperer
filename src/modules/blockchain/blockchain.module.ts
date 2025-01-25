import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HeliusProvider } from './providers/helius.provider';
import { BlockchainService } from './services/blockchain.service';

@Module({
  imports: [ConfigModule],
  providers: [HeliusProvider, BlockchainService],
  exports: [BlockchainService],
})
export class BlockchainModule {}

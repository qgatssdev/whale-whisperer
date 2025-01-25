import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Helius } from 'helius-sdk';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private readonly logger = new Logger(BlockchainService.name);

  constructor(@Inject('HELIUS_CONNECTION') private readonly helius: Helius) {
    this.logger.log('BlockchainService initialized');
  }

  async onModuleInit() {
    this.logger.log('Initializing blockchain listener...');
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.helius.connection.onLogs('all', (logs) => {
      // this.logger.log(`New transaction: ${logs.signature}`);
    });
  }
}

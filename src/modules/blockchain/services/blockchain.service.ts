import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PublicKey } from '@solana/web3.js';
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

  async getTransactions(address: PublicKey) {
    return await this.helius.connection.getSignaturesForAddress(address);
  }

  async getTokenTransfers(address: string) {
    const publicKey = new PublicKey(address);
    return await this.helius.connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'), // SPL Token Program
      },
    );
  }

  async getTokenBalances(address: PublicKey) {
    return this.helius.connection.getTokenAccountBalance(address);
  }

  async getProgramAccounts(programId: PublicKey) {
    return this.helius.connection.getProgramAccounts(programId);
  }
}

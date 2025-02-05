import { Injectable, Logger } from '@nestjs/common';
import { Connection, PublicKey } from '@solana/web3.js';
import { WhaleService } from 'src/modules/whale/services/whale.service';

@Injectable()
export class ClusterService {
  private readonly logger = new Logger(ClusterService.name);
  private SOL_DECIMALS = 1_000_000_000;

  constructor(
    private connection: Connection,
    private whaleService: WhaleService,
  ) {}

  //TODO: get actual type interfaces for all any types

  async getWalletFeatures(address: string) {
    const [balance, transactions] = await Promise.all([
      this.getWalletBalance(address),
      this.connection.getSignaturesForAddress(new PublicKey(address), {
        limit: 100,
      }),
    ]);

    const txDetails = await Promise.all(
      transactions.map((tx) =>
        this.connection.getParsedTransaction(tx.signature),
      ),
    );

    let totalTxAmount = 0;
    let validTxCount = 0;

    for (const tx of txDetails) {
      if (!tx?.meta) continue;

      const accountIndex = tx.transaction.message.accountKeys.findIndex(
        (k) => k.pubkey.toString() === address,
      );

      if (accountIndex === -1) continue;

      const preBalance = tx.meta.preBalances[accountIndex];
      const postBalance = tx.meta.postBalances[accountIndex];
      const amount = Math.abs(postBalance - preBalance);

      totalTxAmount += amount;
      validTxCount++;
    }

    return {
      address,
      balance: balance / this.SOL_DECIMALS,
      txnCount7d: transactions.length,
      avgTransactionSize:
        validTxCount > 0 ? totalTxAmount / validTxCount / this.SOL_DECIMALS : 0,
      clusterScore: await this.calculateClusterScore(address, transactions),
      lastActivity: new Date(transactions[0]?.blockTime * 1000),
      associations: await this.findAssociatedWhales(address),
    };
  }

  async findAssociatedWhales(address: string): Promise<string[]> {
    const transactions = await this.connection.getSignaturesForAddress(
      new PublicKey(address),
      { limit: 100 },
    );

    const counterparties = new Set<string>();
    for (const tx of transactions) {
      const details = await this.connection.getParsedTransaction(tx.signature);
      details?.transaction.message.accountKeys.forEach((key) => {
        const addr = key.pubkey.toString();
        if (addr !== address) counterparties.add(addr);
      });
    }

    const whaleAddresses: string[] = [];
    for (const addr of counterparties) {
      if (await this.whaleService.isKnownWhale(addr)) {
        whaleAddresses.push(addr);
      }
    }

    return whaleAddresses;
  }

  private async calculateClusterScore(
    address: string,
    transactions: any[],
  ): Promise<number> {
    const associatedWhales = await this.findAssociatedWhales(address);
    const totalCounterparties = new Set<string>();

    transactions.forEach((tx) => {
      tx.transaction.message.accountKeys.forEach((key: any) => {
        const addr = key.pubkey.toString();
        if (addr !== address) totalCounterparties.add(addr);
      });
    });

    if (totalCounterparties.size === 0) return 0;

    return (associatedWhales.length / totalCounterparties.size) * 100;
  }

  async getWalletBalance(address: string): Promise<number> {
    return this.connection.getBalance(new PublicKey(address));
  }

  async getTransactionCount(address: string, days: number): Promise<number> {
    const signatures = await this.connection.getSignaturesForAddress(
      new PublicKey(address),
      { limit: 1000 },
    );

    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return signatures.filter((sig) => sig.blockTime * 1000 > cutoff).length;
  }
}

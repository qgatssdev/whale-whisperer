import { Injectable, Logger } from '@nestjs/common';
import { DeepSeekService } from 'src/modules/deepseek/services/deepseek.service';
import { HARD_RULES } from 'src/libs/common/constants';
import { WhaleService } from 'src/modules/whale/services/whale.service';
import { ClusterService } from './cluster.service';

@Injectable()
export class WhaleDetectorService {
  private readonly logger = new Logger(WhaleDetectorService.name);

  constructor(
    private whaleService: WhaleService,
    private deepSeek: DeepSeekService,
    private clusterService: ClusterService,
  ) {}

  async evaluateWallet(address: string): Promise<boolean> {
    if (await this.whaleService.isKnownWhale(address)) {
      return true;
    }

    if (await this.meetsHardRules(address)) {
      await this.whaleService.addWhale(address, 'rule');
      return true;
    }

    try {
      const features = await this.clusterService.getWalletFeatures(address);
      const aiResult = await this.deepSeek.analyzeWallet(features);

      if (aiResult.isWhale) {
        await this.whaleService.addWhale(address, 'ai', aiResult.confidence);
        return true;
      }
    } catch (error) {
      this.logger.error(`DeepSeek analysis failed: ${error.message}`);
    }

    return false;
  }

  private async meetsHardRules(address: string): Promise<boolean> {
    const [balance, txnCount] = await Promise.all([
      this.clusterService.getWalletBalance(address),
      this.clusterService.getTransactionCount(address, 14),
    ]);

    return (
      balance > HARD_RULES.MIN_BALANCE || txnCount > HARD_RULES.MIN_7D_ACTIVITY
    );
  }
}

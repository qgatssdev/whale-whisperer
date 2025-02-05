import { Injectable, Logger } from '@nestjs/common';
import { ClusterService } from './cluster.service';
import { WhaleService } from 'src/modules/whale/services/whale.service';
import { HARD_RULES } from 'src/libs/common/constants';
import { AIMonitorAgentService } from 'src/modules/ai-models/services/ai-monitor-model.service';

@Injectable()
export class WhaleDetectorService {
  private readonly logger = new Logger(WhaleDetectorService.name);

  constructor(
    private whaleService: WhaleService,
    private aiMonitorAgentService: AIMonitorAgentService,
    private clusterService: ClusterService,
  ) {}

  async evaluateWallet(address: string): Promise<boolean> {
    if (await this.whaleService.isKnownWhale(address)) {
      return true;
    }

    if (await this.meetsHardRules(address)) {
      await this.whaleService.addWhale({ address, source: 'rule' });
      return true;
    }

    try {
      const aiResult = await this.aiMonitorAgentService.analyzeWallet(address);

      if (this.isWhaleByAIAnalysis(aiResult)) {
        await this.whaleService.addWhale({
          address,
          source: 'ai',
          confidence: aiResult.confidence,
          tradingStyle: aiResult.tradingStyle,
          strengths: aiResult.keyStrengths,
          riskScore: aiResult.analysis.riskManagement,
          profitabilityScore: aiResult.profitabilityScore,
        });
        return true;
      }
    } catch (error) {
      this.logger.error(
        `Failed to evaluate wallet ${address}: ${error.message}`,
        error.stack,
      );
    }

    return false;
  }

  private isWhaleByAIAnalysis(analysis: any): boolean {
    return (
      analysis.isSuccessfulTrader &&
      analysis.confidence > 75 &&
      analysis.profitabilityScore > 70 &&
      analysis.analysis.patternQuality > 65
    );
  }

  private async meetsHardRules(address: string): Promise<boolean> {
    try {
      const [balance, txnCount] = await Promise.all([
        this.clusterService.getWalletBalance(address),
        this.clusterService.getTransactionCount(address, 14),
      ]);

      const meetsBalance = balance > HARD_RULES.MIN_BALANCE;
      const meetsActivity = txnCount > HARD_RULES.MIN_14D_ACTIVITY;

      if (meetsBalance && meetsActivity) {
        this.logger.debug(
          `Wallet ${address} meets hard rules: Balance: ${balance}, TxCount: ${txnCount}`,
        );

        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(
        `Failed to check hard rules for ${address}: ${error.message}`,
      );
      return false;
    }
  }
}

// import { Injectable, Logger } from '@nestjs/common';
// import { WhaleService } from '../whale/whale.service';
// import { DeepSeekService } from '../ai/deepseek.service';
// import { ClusterService } from '../cluster/cluster.service';
// import { HARD_RULES } from './detection-rules';

// @Injectable()
// export class WhaleDetectorService {
//   private readonly logger = new Logger(WhaleDetectorService.name);

//   constructor(
//     private whaleService: WhaleService,
//     private deepSeek: DeepSeekService,
//     private clusterService: ClusterService,
//   ) {}

//   async evaluateWallet(address: string): Promise<boolean> {
//     // Check existing database first
//     if (await this.whaleService.isKnownWhale(address)) {
//       return true;
//     }

//     // Hard rule check
//     if (await this.meetsHardRules(address)) {
//       await this.whaleService.addWhale(address, 'rule-based');
//       return true;
//     }

//     // DeepSeek AI analysis
//     try {
//       const features = await this.clusterService.getWalletFeatures(address);
//       const aiResult = await this.deepSeek.analyzeWallet(features);

//       if (aiResult.isWhale) {
//         await this.whaleService.addWhale(
//           address,
//           'ai-detected',
//           aiResult.confidence,
//         );
//         return true;
//       }
//     } catch (error) {
//       this.logger.error(`DeepSeek analysis failed: ${error.message}`);
//     }

//     return false;
//   }

//   private async meetsHardRules(address: string): Promise<boolean> {
//     const [balance, txnCount] = await Promise.all([
//       this.clusterService.getWalletBalance(address),
//       this.clusterService.getTransactionCount(address, 7),
//     ]);

//     return (
//       balance > HARD_RULES.MIN_BALANCE || txnCount > HARD_RULES.MIN_7D_ACTIVITY
//     );
//   }
// }

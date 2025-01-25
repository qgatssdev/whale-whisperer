import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { WalletFeatures } from '../interface/deepseek.interface';
import { Config } from 'src/config';

@Injectable()
export class DeepSeekService {
  private readonly apiUrl = Config.DEEPSEEK_API_URL;
  private readonly apiKey = Config.DEEPSEEK_API_KEY;

  async analyzeWallet(walletData: WalletFeatures): Promise<boolean> {
    const prompt = this.buildWhaleDetectionPrompt(walletData);

    const response = await axios.post(
      this.apiUrl,
      {
        model: 'deepseek-reasoner',
        messages: [{ role: 'user', content: prompt }],
        temperature: 1.0,
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );

    return response.data.choices[0].message.content;
  }

  private buildWhaleDetectionPrompt(data: WalletFeatures): string {
    return `
    Analyze this Solana wallet to determine if it belongs to a cryptocurrency "whale":
    
    **Wallet Features**:
    - Balance: ${data.balance} SOL
    - Transactions (7d): ${data.txnCount7d}
    - Avg TX Size: ${data.avgTransactionSize} SOL
    - Cluster Score: ${data.clusterScore}/10
    - Associated Labels: ${data.associations.join(', ') || 'None'}
    
    **Instructions**:
    1. Consider whales as entities controlling ≥0.1% of circulating supply
    2. Flag manipulative patterns (e.g., wash trading)
    3. Evaluate network influence through cluster associations
    4. Identify "smart money" patterns (early token purchases)
    
    Respond ONLY with JSON: { "isWhale": boolean, "confidence": 0-100, "reason": "<50chars>" }
    `;
  }
}

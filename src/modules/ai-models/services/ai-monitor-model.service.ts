import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { BirdeyeService } from 'src/modules/whale-detector/services/birdeye.service';
import { Config } from 'src/config';

@Injectable()
export class AIMonitorAgentService {
  private readonly logger = new Logger(AIMonitorAgentService.name);
  private readonly apiUrl = Config.AIMODEL_API_URL;
  private readonly apiKey = Config.AIMODEL_API_KEY;
  private readonly modelType = Config.AIMODEL_TYPE;

  constructor(private readonly birdeyeService: BirdeyeService) {}

  async analyzeWallet(walletAddress: string) {
    try {
      const walletData =
        await this.birdeyeService.analyzeWalletActivity(walletAddress);

      return await this.getAIAnalysis({
        address: walletAddress,
        ...walletData,
      });
    } catch (error) {
      this.logger.error(`Failed to analyze wallet: ${error.message}`);
      throw error;
    }
  }

  private async getAIAnalysis(walletData: any) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.modelType,
          messages: [
            {
              role: 'system',
              content: this.getSystemPrompt(),
            },
            {
              role: 'user',
              content: this.buildAnalysisPrompt(walletData),
            },
          ],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return this.processAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      this.logger.error('AI analysis failed:', error);
      throw error;
    }
  }

  private getSystemPrompt(): string {
    return `You are an expert cryptocurrency analyst specializing in identifying successful meme coin traders on Solana.
            Your task is to analyze wallet behavior and trading patterns to identify successful traders.

            Focus on:
            1. Early entry patterns in successful tokens
            2. Effective exit strategies and profit taking
            3. Position sizing and risk management
            4. Portfolio diversification
            5. Network effects and relationships

            Provide detailed analysis with confidence scores and specific insights.`;
  }

  private buildAnalysisPrompt(data: any): string {
    return `
        Analyze this Solana wallet's trading behavior and determine if it's a successful meme coin trader:

        Wallet Data:
        ${JSON.stringify(data, null, 2)}

        Consider:
        1. Trading pattern sophistication
        2. Risk management approach
        3. Entry/exit timing
        4. Overall profitability
        5. Portfolio management

        Respond with JSON in this format:
        {
          "isSuccessfulTrader": boolean,
          "confidence": number (0-100),
          "tradingStyle": string,
          "keyStrengths": string[],
          "riskFactors": string[],
          "profitabilityScore": number (0-100),
          "recommendations": string[],
          "analysis": {
            "patternQuality": number (0-100),
            "riskManagement": number (0-100),
            "timing": number (0-100),
            "consistency": number (0-100)
          }
}`;
  }

  private processAIResponse(response: string) {
    try {
      const analysis = JSON.parse(response);
      return {
        ...analysis,
        timestamp: new Date().toISOString(),
        confidence: Math.min(Math.max(analysis.confidence, 0), 100),
      };
    } catch (error) {
      this.logger.error('Failed to process AI response:', error);
      throw new Error('Failed to process AI analysis');
    }
  }

  async analyzeTradingPatterns(trades: any[], timeframe: string) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.modelType,
          messages: [
            {
              role: 'system',
              content: 'You are a trading pattern analysis expert.',
            },
            {
              role: 'user',
              content: this.buildTradePatternPrompt(trades, timeframe),
            },
          ],
          temperature: 0.5,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      return this.processAIResponse(response.data.choices[0].message.content);
    } catch (error) {
      this.logger.error('Pattern analysis failed:', error);
      throw error;
    }
  }

  private buildTradePatternPrompt(trades: any[], timeframe: string): string {
    return `
      Analyze these trading patterns over ${timeframe}:
      ${JSON.stringify(trades, null, 2)}

      Identify:
      1. Entry timing patterns relative to token launches
      2. Exit strategy effectiveness
      3. Position sizing patterns
      4. Risk management indicators
      5. Success rate and profitability

      Return analysis as JSON with clear pattern insights and recommendations.`;
  }
}

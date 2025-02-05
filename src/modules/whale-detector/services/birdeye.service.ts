import { Injectable, HttpException } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ANALYSIS_CONSTANTS, TimeFrame, TradeMetrics } from '../interface';
import { Config } from 'src/config';

@Injectable()
export class BirdeyeService {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = Config.BIRDEYE_API_KEY;
    this.baseUrl = Config.BIRDEYE_API_URL;
  }

  private async makeApiRequest<T>(endpoint: string): Promise<any> {
    try {
      const response: AxiosResponse<T> = await axios.get(
        `${this.baseUrl}${endpoint}`,
        {
          headers: { 'X-API-KEY': this.apiKey },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch data from ${endpoint}`,
        error.response?.status || 500,
      );
    }
  }

  async getWalletPortfolio(address: string) {
    return this.makeApiRequest(`/portfolio/tokens?address=${address}`);
  }

  async getTokenHolders(tokenAddress: string) {
    return this.makeApiRequest(`/token/holders?address=${tokenAddress}`);
  }

  async getTokenData(tokenAddress: string) {
    return this.makeApiRequest(`/token/info?address=${tokenAddress}`);
  }

  async getTopPerformingTokens(
    timeframe: TimeFrame = '30d',
    minMarketCap = ANALYSIS_CONSTANTS.MIN_MARKET_CAP,
    maxMarketCap = ANALYSIS_CONSTANTS.MAX_MARKET_CAP,
  ) {
    const response = await this.makeApiRequest<any>(
      `/token/prices-performance?chain=solana&timeframe=${timeframe}`,
    );

    return response.data.filter((token: any) => {
      return (
        token.marketCap >= minMarketCap &&
        token.marketCap <= maxMarketCap &&
        token.priceChange.percent > ANALYSIS_CONSTANTS.MIN_PRICE_CHANGE_PERCENT
      );
    });
  }

  async getTokenPriceHistory(
    tokenAddress: string,
    timeframe: TimeFrame = '24h',
  ) {
    return this.makeApiRequest(
      `/token/price-history?address=${tokenAddress}&timeframe=${timeframe}`,
    );
  }

  async getTokenTransactions(tokenAddress: string, limit: number = 100) {
    return this.makeApiRequest(
      `/token/transactions?address=${tokenAddress}&limit=${limit}`,
    );
  }

  async getWalletTransactionHistory(
    address: string,
    limit: number = 100,
    timeframe: TimeFrame = '7d',
  ) {
    return this.makeApiRequest(
      `/wallet/transactions?wallet=${address}&limit=${limit}&timeframe=${timeframe}`,
    );
  }

  async analyzeWalletActivity(address: string, timeframe: TimeFrame = '7d') {
    const [portfolio, transactions] = await Promise.all([
      this.getWalletPortfolio(address),
      this.getWalletTransactionHistory(address, 100, timeframe),
    ]);

    const timeframeMs = this.getTimeframeInMs(timeframe);
    const filteredTransactions = transactions.data.filter(
      (tx) => Date.now() - new Date(tx.timestamp).getTime() <= timeframeMs,
    );

    return {
      portfolio: this.analyzePortfolio(portfolio.data),
      tradingMetrics: this.calculateTradeMetrics(filteredTransactions),
    };
  }

  private getTimeframeInMs(timeframe: TimeFrame): number {
    switch (timeframe) {
      case '24h':
        return ANALYSIS_CONSTANTS.MS_PER_DAY;
      case '7d':
        return 7 * ANALYSIS_CONSTANTS.MS_PER_DAY;
      case '30d':
        return 30 * ANALYSIS_CONSTANTS.MS_PER_DAY;
      default:
        return 7 * ANALYSIS_CONSTANTS.MS_PER_DAY;
    }
  }

  private analyzePortfolio(portfolio: any[]) {
    const totalValue = portfolio.reduce((sum, token) => sum + token.value, 0);
    return {
      totalValue,
      tokenCount: portfolio.length,
      topHoldings: portfolio
        .sort((a, b) => b.value - a.value)
        .slice(0, 5)
        .map((token) => ({
          address: token.address,
          symbol: token.symbol,
          value: token.value,
          percentageOfPortfolio: (token.value / totalValue) * 100,
        })),
    };
  }

  private calculateTradeMetrics(trades: any[]): TradeMetrics {
    if (!trades?.length) {
      return {
        successRate: 0,
        totalProfit: 0,
        tradeCount: 0,
        averageProfitPerTrade: 0,
        winningStreak: 0,
        largestGain: 0,
        averageHoldTime: 0,
      };
    }

    let profitableTrades = 0;
    let totalProfit = 0;
    let currentStreak = 0;
    let maxStreak = 0;
    let largestGain = 0;
    let totalHoldTime = 0;

    const sortedTrades = [...trades].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    for (const trade of sortedTrades) {
      const profitLoss = this.calculateTradeProfitLoss(trade);

      if (profitLoss > 0) {
        profitableTrades++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
        largestGain = Math.max(largestGain, profitLoss);
      } else {
        currentStreak = 0;
      }

      totalProfit += profitLoss;

      if (trade.exitTimestamp && trade.entryTimestamp) {
        totalHoldTime +=
          new Date(trade.exitTimestamp).getTime() -
          new Date(trade.entryTimestamp).getTime();
      }
    }

    return {
      successRate: (profitableTrades / trades.length) * 100,
      totalProfit,
      tradeCount: trades.length,
      averageProfitPerTrade: totalProfit / trades.length,
      winningStreak: maxStreak,
      largestGain,
      averageHoldTime: totalHoldTime / trades.length,
    };
  }

  private calculateTradeProfitLoss(trade: any) {
    return (trade.exitPrice - trade.entryPrice) * trade.amount;
  }
}

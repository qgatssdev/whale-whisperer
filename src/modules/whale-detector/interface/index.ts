export interface TradeMetrics {
  successRate: number;
  totalProfit: number;
  tradeCount: number;
  averageProfitPerTrade: number;
  winningStreak: number;
  largestGain: number;
  averageHoldTime: number;
}

export interface TradeMetrics {
  successRate: number;
  totalProfit: number;
  tradeCount: number;
  averageProfitPerTrade: number;
  winningStreak: number;
  largestGain: number;
  averageHoldTime: number;
}

export type TimeFrame = '24h' | '7d' | '30d';

export const ANALYSIS_CONSTANTS = {
  MIN_MARKET_CAP: 100000,
  MAX_MARKET_CAP: 100000000,
  MIN_PRICE_CHANGE_PERCENT: 50,
  MS_PER_DAY: 24 * 60 * 60 * 1000,
};

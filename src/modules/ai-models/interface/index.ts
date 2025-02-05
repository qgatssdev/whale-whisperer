export interface WalletFeatures {
  balance: number;
  txnCount7d: number;
  avgTransactionSize: number;
  clusterScore: number;
  associations: string[];
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

export interface PortfolioAnalysis {
  totalValue: number;
  tokenCount: number;
  topHoldings: TokenHolding[];
}

export interface TokenHolding {
  address: string;
  symbol: string;
  value: number;
  percentageOfPortfolio: number;
}

export interface AIRecommendation {
  actions: AIAction[];
  analysisSteps: string[];
}

export interface AIAction {
  type: 'API_CALL';
  endpoint: BirdeyeEndpoint;
  parameters: Record<string, any>;
  purpose: string;
}

export type BirdeyeEndpoint =
  | 'getWalletPortfolio'
  | 'getTokenHolders'
  | 'getTokenData'
  | 'getTopPerformingTokens'
  | 'getTokenPriceHistory'
  | 'getTokenTransactions'
  | 'getWalletTransactionHistory';

export type TimeFrame = '24h' | '7d' | '30d';

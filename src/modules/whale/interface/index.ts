import { Whale } from '../entity/whale.entity';

export type AddWhale = {
  address: string;
  source: Whale['detectionSource'];
  confidence?: number;
  tradingStyle?: string;
  strengths?: string;
  riskScore?: number;
  profitabilityScore?: number;
};

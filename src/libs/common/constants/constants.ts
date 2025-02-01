export const CREATED_AT_COLUMN = 'createdAt';

export enum InjectionTokens {
  EMAIL_CLIENT = 'EMAIL_CLIENT',
}

export interface WhaleCriteria {
  minBalanceSOL: number;
  minTxPerDay: number;
  minWinRate: number;
}

export const HARD_RULES = {
  MIN_BALANCE: 1_000_000, // $1M SOL equivalent
  MIN_14D_ACTIVITY: 20, // Transactions in last 2 weeks
  MIN_ASSOCIATIONS: 2, // Links to known whales
};

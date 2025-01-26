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
  MIN_BALANCE: 500_000, // $500k SOL equivalent
  MIN_7D_ACTIVITY: 20, // Transactions in last 7 days
  MIN_ASSOCIATIONS: 2, // Links to known whales
};

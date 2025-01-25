export const CREATED_AT_COLUMN = 'createdAt';

export enum InjectionTokens {
  EMAIL_CLIENT = 'EMAIL_CLIENT',
}

export interface WhaleCriteria {
  minBalanceSOL: number;
  minTxPerDay: number;
  minWinRate: number;
}

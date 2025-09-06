export * as b_types from '#bemedev/globals/types';

export type On = 'mine' | 'all';

export type SmartContract = {
  address: string;
  on: On;
  id: string;
  userId?: string;
  amount: number;
  percent: number;
  currency: string;
  description?: string;
  precedents?: SmartContract[];
};

export const D = 10;

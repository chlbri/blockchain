// An intermediary in the chain
export interface Intermediary {
  id: string;
  name: string;
  // TODO:  to define
  wallet: string;
}

// Commission type
export type CommissionType =
  | { mode: 'fixed'; amount: number }
  | { mode: 'percentage'; percentage: number };

// Commission procedure defined by the first intermediary
export interface CommissionProcedure {
  type: CommissionType;
  // Distribution formula: array of percentages or custom function
  distribution: (
    total: number,
    ...intermediaries: readonly Intermediary[]
  ) => number[];
}

// An asset for sale
export interface Asset {
  id: string;
  description: string;
  value: number;
  currency: string;
}

// A sale transaction
export interface Contract {
  asset: Asset;
  intermediaries: Intermediary[];
  procedure: CommissionProcedure;
  buyer: string;
  date: Date;
}

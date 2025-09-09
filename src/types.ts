type PhoneNumber = {
  countryCode: number;
  number: number;
  network?: string;
};

// An intermediary in the chain

export type Intermediary = {
  id: string;

  // TODO:  to define
  wallet: string;
  sacrifice?: number;
  contacts: {
    phoneNumbers: [PhoneNumber, ...PhoneNumber[]];
    emails?: string[];
    socials?: Record<string, string>;
    websites?: string[];
  };
} & (
  | {
      personality: 'individual';
      nationalID: string;
      name: {
        firstName?: string;
        lastName: string;
      };
    }
  | {
      personality: 'company';
      companyName: string;
      registrationNumber: string;
    }
);

// Commission type
export type CommissionType =
  | { mode: 'fixed'; amount: number }
  | { mode: 'percentage'; percentage: number };

// Commission procedure defined by the first intermediary
export type CommissionProcedure = {
  type: CommissionType;
  // Distribution formula: array of percentages or custom function

  repartitions: number[][];
};

// An asset for sale
export type Asset = {
  id: string;
  description: string;
  value: number;
  currency: string;
};

// A sale transaction
export type Contract = {
  asset: Asset;
  intermediaries: Intermediary[];
  procedure: CommissionProcedure;
  buyer: string;
  date: Date;
};

import { describe, expect, test } from 'vitest';
import { dispatch } from './commission';
import type { Asset, Contract, Intermediary } from './types';

// #region Mock data pour les tests
const mockAsset: Asset = {
  id: 'asset-001',
  description: 'Test Asset',
  value: 10000,
  currency: 'EUR',
};

const mockIntermediary1: Intermediary = {
  id: 'int-001',
  wallet: 'wallet-address-1',
  personality: 'individual',
  nationalID: 'ID123456',
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 33, number: 123456789 }],
  },
};

const mockIntermediary2: Intermediary = {
  id: 'int-002',
  wallet: 'wallet-address-2',
  sacrifice: 50,
  personality: 'company',
  companyName: 'Test Company',
  registrationNumber: 'REG789',
  contacts: {
    phoneNumbers: [{ countryCode: 33, number: 987654321 }],
  },
};

const mockIntermediary3: Intermediary = {
  id: 'int-003',
  wallet: 'wallet-address-3',
  sacrifice: 75,
  personality: 'individual',
  nationalID: 'ID789123',
  name: {
    lastName: 'Smith',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 1, number: 555123456 }],
  },
};

const mockIntermediary4: Intermediary = {
  id: 'int-004',
  wallet: 'wallet-address-4',
  sacrifice: 25,
  personality: 'company',
  companyName: 'Fourth Company',
  registrationNumber: 'REG999',
  contacts: {
    phoneNumbers: [{ countryCode: 44, number: 555987654 }],
  },
};

const mockIntermediary5: Intermediary = {
  id: 'int-005',
  wallet: 'wallet-address-5',
  sacrifice: 100,
  personality: 'individual',
  nationalID: 'ID999888',
  name: {
    firstName: 'Alice',
    lastName: 'Johnson',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 49, number: 555111222 }],
  },
};
// #endregion

describe.concurrent('dispatch', () => {
  describe('#01 => should calculate fixed commission correctly', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [mockIntermediary1],
        procedure: {
          type: { mode: 'fixed', amount: 500 },
          repartitions: [[100]],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 500', () => {
      expect(result.totalCommission).toBe(500);
    });

    test('#02 => should have distribution length of 1', () => {
      expect(result.distribution).toHaveLength(1);
    });

    test('#03 => should have correct intermediary', () => {
      expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
    });

    test('#04 => should have correct amount', () => {
      expect(result.distribution[0].amount).toBe(500);
    });
  });

  describe('#02 => should calculate percentage commission correctly', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [mockIntermediary1],
        procedure: {
          type: { mode: 'percentage', percentage: 5 },
          repartitions: [[100]],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 500 (5% of 10000)', () => {
      expect(result.totalCommission).toBe(500);
    });

    test('#02 => should have distribution length of 1', () => {
      expect(result.distribution).toHaveLength(1);
    });

    test('#03 => should have correct amount', () => {
      expect(result.distribution[0].amount).toBe(500);
    });
  });

  describe('#03 => should distribute commission among multiple intermediaries', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [mockIntermediary1, mockIntermediary2],
        procedure: {
          type: { mode: 'fixed', amount: 1000 },
          repartitions: [[100], [60, 40]],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 1000', () => {
      expect(result.totalCommission).toBe(1000);
    });

    test('#02 => should have distribution length of 2', () => {
      expect(result.distribution).toHaveLength(2);
    });

    test('#03 => first intermediary should receive 600 (60%)', () => {
      expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
      expect(result.distribution[0].amount).toBe(600);
    });

    test('#04 => second intermediary should receive 400 (40%)', () => {
      expect(result.distribution[1].intermediary).toBe(mockIntermediary2);
      expect(result.distribution[1].amount).toBe(400);
    });
  });

  describe('#04 => should handle sacrifice amounts correctly', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [mockIntermediary1, mockIntermediary2],
        procedure: {
          type: { mode: 'fixed', amount: 1000 },
          repartitions: [[100], [50, 50]],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have distribution length of 2', () => {
      expect(result.distribution).toHaveLength(2);
    });

    test('#02 => first intermediary should receive 500 (50%)', () => {
      expect(result.distribution[0].amount).toBe(500);
    });

    test('#03 => second intermediary should receive 500 (50%)', () => {
      expect(result.distribution[1].amount).toBe(500);
    });
  });

  describe('#05 => should handle three intermediaries', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [
          mockIntermediary1,
          mockIntermediary2,
          mockIntermediary3,
        ],
        procedure: {
          type: { mode: 'percentage', percentage: 10 },
          repartitions: [
            [100], // Pour 1 intermédiaire
            [50, 50], // Pour 2 intermédiaires
            [50, 30, 20], // Pour 3 intermédiaires
          ],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 1000 (10% of 10000)', () => {
      expect(result.totalCommission).toBe(1000);
    });

    test('#02 => should have distribution length of 3', () => {
      expect(result.distribution).toHaveLength(3);
    });

    test('#03 => first intermediary should receive 500 (50%)', () => {
      expect(result.distribution[0].amount).toBe(500);
    });

    test('#04 => second intermediary should receive 250 (30% - sacrifice)', () => {
      expect(result.distribution[1].amount).toBe(250);
    });

    test('#05 => third intermediary should receive 250 (20% + sacrifice)', () => {
      expect(result.distribution[2].amount).toBe(250);
    });
  });

  test('#06 => should throw error when no repartition found for intermediaries count', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1, mockIntermediary2],
      procedure: {
        type: { mode: 'fixed', amount: 1000 },
        repartitions: [[100]],
      },
      date: new Date('2025-01-01'),
    };

    expect(() => dispatch(contract)).toThrow(
      'No repartition found for 2 intermediaries',
    );
  });

  describe('#07 => should handle edge case with zero commission', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [mockIntermediary1],
        procedure: {
          type: { mode: 'fixed', amount: 0 },
          repartitions: [[100]],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 0', () => {
      expect(result.totalCommission).toBe(0);
    });

    test('#02 => should have distribution with amount of 0', () => {
      expect(result.distribution[0].amount).toBe(0);
    });
  });

  describe('#08 => should handle percentage commission with zero asset value', () => {
    let result: any;

    beforeAll(() => {
      const zeroValueAsset: Asset = {
        ...mockAsset,
        value: 0,
      };

      const contract: Contract = {
        asset: zeroValueAsset,
        intermediaries: [mockIntermediary1],
        procedure: {
          type: { mode: 'percentage', percentage: 5 },
          repartitions: [[100]],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 0', () => {
      expect(result.totalCommission).toBe(0);
    });

    test('#02 => should have distribution with amount of 0', () => {
      expect(result.distribution[0].amount).toBe(0);
    });
  });

  describe('#09 => should handle chained sacrifices correctly', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [
          mockIntermediary1, // pas de sacrifice
          mockIntermediary2, // sacrifice: 50
          mockIntermediary3, // sacrifice: 75
          mockIntermediary4, // sacrifice: 25
        ],
        procedure: {
          type: { mode: 'fixed', amount: 1000 },
          repartitions: [
            [100], // Pour 1 intermédiaire
            [50, 50], // Pour 2 intermédiaires
            [50, 30, 20], // Pour 3 intermédiaires
            [40, 30, 20, 10], // Pour 4 intermédiaires
          ],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 1000', () => {
      expect(result.totalCommission).toBe(1000);
    });

    test('#02 => should have distribution length of 4', () => {
      expect(result.distribution).toHaveLength(4);
    });

    test('#03 => first intermediary should receive 400 (40%)', () => {
      expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
      expect(result.distribution[0].amount).toBe(400);
    });

    test('#04 => second intermediary should receive 250 (30% - sacrifice)', () => {
      expect(result.distribution[1].intermediary).toBe(mockIntermediary2);
      expect(result.distribution[1].amount).toBe(250);
    });

    test('#05 => third intermediary should receive 175 (20% - sacrifice)', () => {
      expect(result.distribution[2].intermediary).toBe(mockIntermediary3);
      expect(result.distribution[2].amount).toBe(175);
    });

    test('#06 => fourth intermediary should receive 175 (10% + sacrifice)', () => {
      expect(result.distribution[3].intermediary).toBe(mockIntermediary4);
      expect(result.distribution[3].amount).toBe(175);
    });
  });

  describe('#10 => should handle complex chained sacrifices with 5 intermediaries', () => {
    let result: any;

    beforeAll(() => {
      const contract: Contract = {
        asset: mockAsset,
        intermediaries: [
          mockIntermediary1, // pas de sacrifice
          mockIntermediary2, // sacrifice: 50
          mockIntermediary3, // sacrifice: 75
          mockIntermediary4, // sacrifice: 25
          mockIntermediary5, // sacrifice: 100
        ],
        procedure: {
          type: { mode: 'percentage', percentage: 15 }, // 15% de 10000 = 1500
          repartitions: [
            [100], // Pour 1 intermédiaire
            [50, 50], // Pour 2 intermédiaires
            [50, 30, 20], // Pour 3 intermédiaires
            [40, 30, 20, 10], // Pour 4 intermédiaires
            [30, 25, 20, 15, 10], // Pour 5 intermédiaires
          ],
        },
        date: new Date('2025-01-01'),
      };

      result = dispatch(contract);
    });

    test('#01 => should have total commission of 1500 (15% of 10000)', () => {
      expect(result.totalCommission).toBe(1500);
    });

    test('#02 => should have distribution length of 5', () => {
      expect(result.distribution).toHaveLength(5);
    });

    test('#03 => first intermediary should receive 450 (30%)', () => {
      expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
      expect(result.distribution[0].amount).toBe(450);
    });

    test('#04 => second intermediary should receive 325 (25% - sacrifice)', () => {
      expect(result.distribution[1].intermediary).toBe(mockIntermediary2);
      expect(result.distribution[1].amount).toBe(325);
    });

    test('#05 => third intermediary should receive 275 (20% - sacrifice)', () => {
      expect(result.distribution[2].intermediary).toBe(mockIntermediary3);
      expect(result.distribution[2].amount).toBe(275);
    });

    test('#06 => fourth intermediary should receive 275 (15% - sacrifice)', () => {
      expect(result.distribution[3].intermediary).toBe(mockIntermediary4);
      expect(result.distribution[3].amount).toBe(275);
    });

    test('#07 => fifth intermediary should receive 175 (10% + sacrifice)', () => {
      expect(result.distribution[4].intermediary).toBe(mockIntermediary5);
      expect(result.distribution[4].amount).toBe(175);
    });
  });
});

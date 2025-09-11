import { describe, expect, test } from 'vitest';
import { proceedSale } from './commission';
import type { Asset, Contract, Intermediary } from './types';

// Mock data pour les tests
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
  personality: 'individual',
  nationalID: 'ID789123',
  name: {
    lastName: 'Smith',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 1, number: 555123456 }],
  },
};

describe('proceedSale', () => {
  test('#01 => should calculate fixed commission correctly', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1],
      procedure: {
        type: { mode: 'fixed', amount: 500 },
        // Note: Il y a une incohérence de type ici. Le code s'attend à des objets avec length et percent
        // mais les types définissent number[][]. Pour les tests, j'utilise la structure attendue par le code.
        repartitions: [[100]],
      },
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.totalCommission).toBe(500);
    expect(result.distribution).toHaveLength(1);
    expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
    expect(result.distribution[0].amount).toBe(500);
  });

  test('#02 => should calculate percentage commission correctly', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1],
      procedure: {
        type: { mode: 'percentage', percentage: 5 },
        repartitions: [[100]],
      },
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.totalCommission).toBe(500); // 5% of 10000
    expect(result.distribution).toHaveLength(1);
    expect(result.distribution[0].amount).toBe(500);
  });

  test('#03 => should distribute commission among multiple intermediaries', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1, mockIntermediary2],
      procedure: {
        type: { mode: 'fixed', amount: 1000 },
        repartitions: [[100], [60, 40]] as any,
      },
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.totalCommission).toBe(1000);
    expect(result.distribution).toHaveLength(2);

    // Premier intermédiaire: 60% = 600
    expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
    expect(result.distribution[0].amount).toBe(600);

    // Deuxième intermédiaire: 40% = 400 + sacrifice du premier (0) = 400
    expect(result.distribution[1].intermediary).toBe(mockIntermediary2);
    expect(result.distribution[1].amount).toBe(400);
  });

  test('#04 => should handle sacrifice amounts correctly', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1, mockIntermediary2],
      procedure: {
        type: { mode: 'fixed', amount: 1000 },
        repartitions: [[100], [50, 50]],
      },
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.distribution).toHaveLength(2);

    // Premier intermédiaire: 50% = 500, pas de sacrifice
    expect(result.distribution[0].amount).toBe(500);

    // Deuxième intermédiaire: 50% = 500 + sacrifice du premier (0) = 500
    // Note: Le sacrifice du deuxième intermédiaire (50) n'est pas ajouté dans cette logique
    expect(result.distribution[1].amount).toBe(500);
  });

  test('#05 => should handle three intermediaries', () => {
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
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.totalCommission).toBe(1000); // 10% of 10000
    expect(result.distribution).toHaveLength(3);

    expect(result.distribution[0].amount).toBe(500); // 50% of 1000
    expect(result.distribution[1].amount).toBe(250); // 30% of 1000 - sacrifice 50 of second intermediary
    expect(result.distribution[2].amount).toBe(250); // 20% of 1000 + sacrifice 50 of second intermediary
  });

  test('#06 =>should throw error when no repartition found for intermediaries count', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1, mockIntermediary2],
      procedure: {
        type: { mode: 'fixed', amount: 1000 },
        repartitions: [[100]],
      },
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    expect(() => proceedSale(contract)).toThrow(
      'No repartition found for 2 intermediaries',
    );
  });

  test('#07 => should handle edge case with zero commission', () => {
    const contract: Contract = {
      asset: mockAsset,
      intermediaries: [mockIntermediary1],
      procedure: {
        type: { mode: 'fixed', amount: 0 },
        repartitions: [[100]],
      },
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.totalCommission).toBe(0);
    expect(result.distribution[0].amount).toBe(0);
  });

  test('#08 => should handle percentage commission with zero asset value', () => {
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
      buyer: 'buyer-001',
      date: new Date('2025-01-01'),
    };

    const result = proceedSale(contract);

    expect(result.totalCommission).toBe(0);
    expect(result.distribution[0].amount).toBe(0);
  });
});

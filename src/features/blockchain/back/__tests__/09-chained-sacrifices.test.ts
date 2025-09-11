import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from './../commission';
import {
  mockAsset,
  mockIntermediary1,
  mockIntermediary2,
  mockIntermediary3,
  mockIntermediary4,
} from './fixtures';

describe.concurrent('should handle chained sacrifices correctly', () => {
  let result: ReturnType<typeof dispatch>;

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

  describe('#03 => first intermediary distribution', () => {
    test('#01 => should have correct intermediary', () => {
      expect(result.distribution[0].intermediary).toBe(mockIntermediary1);
    });

    test('#02 => should receive 400 (40%)', () => {
      expect(result.distribution[0].amount).toBe(400);
    });
  });

  describe('#04 => second intermediary distribution', () => {
    test('#01 => should have correct intermediary', () => {
      expect(result.distribution[1].intermediary).toBe(mockIntermediary2);
    });

    test('#02 => should receive 250 (30% - sacrifice)', () => {
      expect(result.distribution[1].amount).toBe(250);
    });
  });

  describe('#05 => third intermediary distribution', () => {
    test('#01 => should have correct intermediary', () => {
      expect(result.distribution[2].intermediary).toBe(mockIntermediary3);
    });

    test('#02 => should receive 175 (20% - sacrifice)', () => {
      expect(result.distribution[2].amount).toBe(175);
    });
  });

  describe('#06 => fourth intermediary distribution', () => {
    test('#01 => should have correct intermediary', () => {
      expect(result.distribution[3].intermediary).toBe(mockIntermediary4);
    });

    test('#02 => should receive 175 (10% + sacrifice)', () => {
      expect(result.distribution[3].amount).toBe(175);
    });
  });
});

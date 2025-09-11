import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import {
  mockAsset,
  mockIntermediary1,
  mockIntermediary2,
  mockIntermediary3,
  mockIntermediary4,
  mockIntermediary5,
} from './fixtures';

describe.concurrent(
  'should handle complex chained sacrifices with 5 intermediaries',
  () => {
    let result: ReturnType<typeof dispatch>;

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

    describe('#03 => first intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[0].intermediary).toBe(
          mockIntermediary1,
        );
      });

      test('#02 => should receive 450 (30%)', () => {
        expect(result.distribution[0].amount).toBe(450);
      });
    });

    describe('#04 => second intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[1].intermediary).toBe(
          mockIntermediary2,
        );
      });

      test('#02 => should receive 325 (25% - sacrifice)', () => {
        expect(result.distribution[1].amount).toBe(325);
      });
    });

    describe('#05 => third intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[2].intermediary).toBe(
          mockIntermediary3,
        );
      });

      test('#02 => should receive 275 (20% - sacrifice)', () => {
        expect(result.distribution[2].amount).toBe(275);
      });
    });

    describe('#06 => fourth intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[3].intermediary).toBe(
          mockIntermediary4,
        );
      });

      test('#02 => should receive 275 (15% - sacrifice)', () => {
        expect(result.distribution[3].amount).toBe(275);
      });
    });

    describe('#07 => fifth intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[4].intermediary).toBe(
          mockIntermediary5,
        );
      });

      test('#02 => should receive 175 (10% + sacrifice)', () => {
        expect(result.distribution[4].amount).toBe(175);
      });
    });
  },
);

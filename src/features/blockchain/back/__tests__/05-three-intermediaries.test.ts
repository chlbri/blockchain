import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import {
  mockAsset,
  mockIntermediary1,
  mockIntermediary2,
  mockIntermediary3,
} from './fixtures';

describe.concurrent('should handle three intermediaries', () => {
  let result: ReturnType<typeof dispatch>;

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

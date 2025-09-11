import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import { mockAsset, mockIntermediary1 } from './fixtures';

describe.concurrent('should handle edge case with zero commission', () => {
  let result: ReturnType<typeof dispatch>;

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

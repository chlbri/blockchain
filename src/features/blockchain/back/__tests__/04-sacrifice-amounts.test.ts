import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import {
  mockAsset,
  mockIntermediary1,
  mockIntermediary2,
} from './fixtures';

describe.concurrent('should handle sacrifice amounts correctly', () => {
  let result: ReturnType<typeof dispatch>;

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

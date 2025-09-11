import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import { mockAsset, mockIntermediary1 } from './fixtures';

describe.concurrent(
  'should calculate percentage commission correctly',
  () => {
    let result: ReturnType<typeof dispatch>;

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

    test('#01 => should have total commission of 500 (5% of 10000)', () =>
      expect(result.totalCommission).toBe(500));

    test('#02 => should have distribution length of 1', () =>
      expect(result.distribution).toHaveLength(1));

    test('#03 => should have correct amount', () =>
      expect(result.distribution[0].amount).toBe(500));
  },
);

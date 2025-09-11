import type { Asset, Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import { mockAsset, mockIntermediary1 } from './fixtures';

describe.concurrent(
  'should handle percentage commission with zero asset value',
  () => {
    let result: ReturnType<typeof dispatch>;

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
  },
);

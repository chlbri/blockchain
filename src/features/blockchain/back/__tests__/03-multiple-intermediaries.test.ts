import type { Contract } from '#types';
import { beforeAll, describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import {
  mockAsset,
  mockIntermediary1,
  mockIntermediary2,
} from './fixtures';

describe.concurrent(
  'should distribute commission among multiple intermediaries',
  () => {
    let result: ReturnType<typeof dispatch>;

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

    describe('#03 => first intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[0].intermediary).toBe(
          mockIntermediary1,
        );
      });

      test('#02 => should receive 600 (60%)', () => {
        expect(result.distribution[0].amount).toBe(600);
      });
    });

    describe('#04 => second intermediary distribution', () => {
      test('#01 => should have correct intermediary', () => {
        expect(result.distribution[1].intermediary).toBe(
          mockIntermediary2,
        );
      });

      test('#02 => should receive 400 (40%)', () => {
        expect(result.distribution[1].amount).toBe(400);
      });
    });
  },
);

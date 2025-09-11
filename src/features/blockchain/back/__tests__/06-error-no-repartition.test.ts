import type { Contract } from '#types';
import { describe, expect, test } from 'vitest';
import { dispatch } from '../commission';
import {
  mockAsset,
  mockIntermediary1,
  mockIntermediary2,
} from './fixtures';

describe.concurrent(
  'should throw error when no repartition found for intermediaries count',
  () => {
    test('#01 => should throw error for 2 intermediaries with only 1 repartition', () => {
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
  },
);

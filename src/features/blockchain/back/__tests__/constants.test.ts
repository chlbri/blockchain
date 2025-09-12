import { describe, expect, it } from 'vitest';
import { DEFAULT_REPARTITIONS } from '../constants';

describe.concurrent('DEFAULT_REPARTITIONS', () => {
  it('#01 => should have each repartition array sum to 100', () => {
    DEFAULT_REPARTITIONS.forEach((repartition, index) => {
      const sum = repartition.reduce((acc, value) => acc + value, 0);
      expect(
        sum,
        `Repartition at index ${index} (${repartition.join(', ')}) should sum to 100 but sums to ${sum}`,
      ).toBe(100);
    });
  });

  it('#02 => should have the correct number of intermediaries for each repartition', () => {
    DEFAULT_REPARTITIONS.forEach((repartition, index) => {
      const expectedIntermediaries = index + 1;
      expect(
        repartition.length,
        `Repartition at index ${index} should have ${expectedIntermediaries} intermediaries but has ${repartition.length}`,
      ).toBe(expectedIntermediaries);
    });
  });

  it('#03 => should have all positive values', () => {
    DEFAULT_REPARTITIONS.forEach((repartition, index) => {
      repartition.forEach((value, valueIndex) => {
        expect(
          value,
          `Value at index ${valueIndex} in repartition ${index} should be positive but is ${value}`,
        ).toBeGreaterThan(0);
      });
    });
  });

  it('#04 => should have balanced repartitions (no value exceeds 50% except for single intermediary)', () => {
    DEFAULT_REPARTITIONS.forEach((repartition, index) => {
      if (repartition.length > 1) {
        repartition.forEach((value, valueIndex) => {
          expect(
            value,
            `Value at index ${valueIndex} in repartition ${index} should not exceed 50% but is ${value}%`,
          ).toBeLessThanOrEqual(50);
        });
      }
    });
  });

  it('#05 => should have 7 different repartition configurations', () => {
    expect(DEFAULT_REPARTITIONS).toHaveLength(7);
  });

  describe('#06 => individual repartitions', () => {
    it('#01 => 1 intermediary: [100]', () => {
      expect(DEFAULT_REPARTITIONS[0]).toEqual([100]);
    });

    it('#02 => 2 intermediaries: [50, 50]', () => {
      expect(DEFAULT_REPARTITIONS[1]).toEqual([50, 50]);
    });

    it('#03 => 3 intermediaries: [35, 30, 35]', () => {
      expect(DEFAULT_REPARTITIONS[2]).toEqual([35, 30, 35]);
    });

    it('#04 => 4 intermediaries: [30, 20, 20, 30]', () => {
      expect(DEFAULT_REPARTITIONS[3]).toEqual([30, 20, 20, 30]);
    });

    it('#05 => 5 intermediaries: [23, 18, 18, 18, 23]', () => {
      expect(DEFAULT_REPARTITIONS[4]).toEqual([23, 18, 18, 18, 23]);
    });

    it('#06 => 6 intermediaries: [20, 15, 15, 15, 15, 20]', () => {
      expect(DEFAULT_REPARTITIONS[5]).toEqual([20, 15, 15, 15, 15, 20]);
    });

    it('#07 => 7 intermediaries: [18, 13, 13, 13, 13, 13, 17]', () => {
      expect(DEFAULT_REPARTITIONS[6]).toEqual([
        17, 13, 13, 13, 13, 13, 18,
      ]);
    });
  });
});

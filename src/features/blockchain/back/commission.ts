import '#bemedev/features/numbers/overload/percent';
import type { Contract, Intermediary } from './types';

// Calculate the total commission according to the procedure
const calculateTotalCommission = (sale: Contract): number => {
  const { procedure, asset } = sale;
  if (procedure.type.mode === 'fixed') {
    return procedure.type.amount;
  } else {
    return (asset.value * procedure.type.percentage) / 100;
  }
};

// Distribute the total commission among the intermediaries
const distributeCommission = (sale: Contract, total: number) => {
  const { intermediaries, procedure } = sale;
  const len = intermediaries.length;

  // Find the appropriate repartition based on number of intermediaries
  const repartition = procedure.repartitions.find(
    ({ length }) => length === len,
  );

  if (!repartition)
    throw new Error(`No repartition found for ${len} intermediaries`);

  let nextSacrifice = 0;

  const out: {
    intermediary: Intermediary;
    amount: number;
  }[] = [];

  const len1 = len - 1;
  // Calculate distribution for each intermediary
  intermediaries.forEach((intermediary, index) => {
    const percentage = repartition[index];
    // The last intermediary does not give away their sacrifice
    const currentSacrifice =
      index === len1 ? 0 : intermediary.sacrifice || 0;

    out.push({
      intermediary,
      amount:
        total * percentage.percent + nextSacrifice - currentSacrifice,
    });

    nextSacrifice = currentSacrifice;
  });

  return out;
};

export const dispatch = (contract: Contract) => {
  const totalCommission = calculateTotalCommission(contract);
  const distribution = distributeCommission(contract, totalCommission);
  return { totalCommission, distribution };
};

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
  const numberOfIntermediaries = intermediaries.length;

  // Find the appropriate repartition based on number of intermediaries
  const repartition = procedure.repartitions.find(
    rep => rep.length === numberOfIntermediaries,
  );

  if (!repartition) {
    throw new Error(
      `No repartition found for ${numberOfIntermediaries} intermediaries`,
    );
  }

  let sacrifice = 0;

  const out: {
    intermediary: Intermediary;
    amount: number;
  }[] = [];

  // Calculate distribution for each intermediary
  intermediaries.forEach((intermediary, index) => {
    const percentage = repartition[index];
    out.push({
      intermediary,
      amount: total * percentage.percent + sacrifice,
    });
    sacrifice = intermediary.sacrifice || 0;
  });

  return out;
};

export const proceedSale = (sale: Contract) => {
  const totalCommission = calculateTotalCommission(sale);
  const distribution = distributeCommission(sale, totalCommission);
  return { totalCommission, distribution };
};

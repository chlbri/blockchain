import { Contract } from './types';

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
  return procedure.distribution(total, ...intermediaries);
};

export const proceedSale = (sale: Contract) => {
  const total = calculateTotalCommission(sale);
  const distribution = distributeCommission(sale, total);
  return { total, distribution };
};

import type { Currency } from '../schemas';

export const CURRENCIES = [
  { display: 'CFA', code: 'XOF', description: 'Franc CFA' },
  { display: '€', code: 'EUR', description: 'Euro' },
  { display: '$', code: 'USD', description: 'US Dollar' },
  { display: '£', code: 'GBP', description: 'British Pound' },
  { display: '¥', code: 'JPY', description: 'Japanese Yen' },
  { display: 'C$', code: 'CAD', description: 'Canadian Dollar' },
  { display: 'A$', code: 'AUD', description: 'Australian Dollar' },
  { display: 'CHF', code: 'CHF', description: 'Swiss Franc' },
] as const satisfies Currency[];

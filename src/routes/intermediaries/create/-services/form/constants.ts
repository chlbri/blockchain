import type { Intermediary } from '#types';

export const DEFAULT_INTERMEDIARY: Omit<Intermediary, 'id'> = {
  wallet: '',
  contacts: {
    phoneNumbers: [
      {
        countryCode: 33,
        number: 0,
      },
    ],
  },
  personality: 'individual',
  nationalID: '',
  name: {
    firstName: '',
    lastName: '',
  },
} as Omit<Intermediary, 'id'>;

export const INTERMEDIARIES_STORAGE_KEY = 'intermediaries->';

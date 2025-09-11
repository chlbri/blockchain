import type { Asset, Intermediary } from '../types';

// Mock data pour les tests
export const mockAsset: Asset = {
  id: 'asset-001',
  description: 'Test Asset',
  value: 10000,
  currency: 'EUR',
  media: {
    photos: ['photo1.jpg', 'photo2.jpg'],
    videos: ['video1.mp4'],
    documents: ['doc1.pdf'],
  },
};

export const mockIntermediary1: Intermediary = {
  id: 'int-001',
  wallet: 'wallet-address-1',
  personality: 'individual',
  nationalID: 'ID123456',
  name: {
    firstName: 'John',
    lastName: 'Doe',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 33, number: 123456789 }],
  },
};

export const mockIntermediary2: Intermediary = {
  id: 'int-002',
  wallet: 'wallet-address-2',
  sacrifice: 50,
  personality: 'company',
  companyName: 'Test Company',
  registrationNumber: 'REG789',
  contacts: {
    phoneNumbers: [{ countryCode: 33, number: 987654321 }],
  },
};

export const mockIntermediary3: Intermediary = {
  id: 'int-003',
  wallet: 'wallet-address-3',
  sacrifice: 75,
  personality: 'individual',
  nationalID: 'ID789123',
  name: {
    lastName: 'Smith',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 1, number: 555123456 }],
  },
};

export const mockIntermediary4: Intermediary = {
  id: 'int-004',
  wallet: 'wallet-address-4',
  sacrifice: 25,
  personality: 'company',
  companyName: 'Fourth Company',
  registrationNumber: 'REG999',
  contacts: {
    phoneNumbers: [{ countryCode: 44, number: 555987654 }],
  },
};

export const mockIntermediary5: Intermediary = {
  id: 'int-005',
  wallet: 'wallet-address-5',
  sacrifice: 100,
  personality: 'individual',
  nationalID: 'ID999888',
  name: {
    firstName: 'Alice',
    lastName: 'Johnson',
  },
  contacts: {
    phoneNumbers: [{ countryCode: 49, number: 555111222 }],
  },
};

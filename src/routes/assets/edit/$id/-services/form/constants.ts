import { CURRENCIES } from '#features/blockchain/back';
import type { Asset } from '#types';

export const DEFAULT_CONTRACT: Asset = {
  id: '',
  description: '',
  value: 0,
  currency: CURRENCIES[0],
  medias: {
    photos: [],
    videos: [],
    documents: [],
  },
};

export const CONTRACTS_STORAGE_KEY = 'assets->';

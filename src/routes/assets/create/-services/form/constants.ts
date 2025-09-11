import type { Asset } from '#types';

export const DEFAULT_ASSET: Asset = {
  id: '',
  description: '',
  value: 0,
  currency: 'EUR',
  medias: {
    photos: [],
    videos: [],
    documents: [],
  },
};

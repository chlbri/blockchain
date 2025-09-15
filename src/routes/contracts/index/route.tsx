import type { Asset } from '#types';
import { createFileRoute, Link } from '@tanstack/solid-router';
import ls from 'localstorage-slim';

import { CURRENCIES } from '#features/blockchain/back';
import { createSignal, For, onMount, Show } from 'solid-js';
import { CONTRACTS_STORAGE_KEY } from '../create/-services/form/constants';

// Local implementation of displayNumber
const displayNumber = (num: string) => {
  if (!num) return '';

  const parts = num.split('.');
  const integer = parts[0] || '';
  const decimal = parts[1];

  if (!integer) return '';

  let result = '';
  for (let i = integer.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      result = '.' + result;
    }
    result = integer[i] + result;
  }

  return decimal ? `${result},${decimal}` : result;
};

export const Route = createFileRoute('/contracts/')({
  component: AssetsPage,
});

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    id: 'asset-001',
    description: 'Appartement T3 centre-ville Abidjan',
    value: 2500000,
    currency: CURRENCIES[0],
    medias: {
      photos: [
        'https://example.com/photo1.jpg',
        'https://example.com/photo2.jpg',
      ],
      videos: ['https://example.com/video1.mp4'],
      documents: ['https://example.com/contract.pdf'],
    },
  },
  {
    id: 'asset-002',
    description: 'Bureau commercial Grand-Bassam',
    value: 150000000,
    currency: CURRENCIES[0],
    medias: {
      photos: ['https://example.com/office.jpg'],
      videos: [],
      documents: ['https://example.com/lease.pdf'],
    },
  },
  {
    id: 'asset-003',
    description: 'Terrain constructible Koumassi',
    value: 75000000,
    currency: CURRENCIES[0],
    medias: {
      photos: [],
      videos: [],
      documents: ['https://example.com/cadastre.pdf'],
    },
  },
];

function AssetsPage() {
  const [assets, setAssets] = createSignal<Asset[]>(mockAssets);
  const [searchTerm, setSearchTerm] = createSignal('');

  const filteredAssets = () => {
    const term = searchTerm().toLowerCase();
    return assets().filter(
      asset =>
        asset.id.toLowerCase().includes(term) ||
        asset.description.toLowerCase().includes(term) ||
        asset.currency.toLowerCase().includes(term),
    );
  };

  onMount(() => {
    const _storedAssets = ls.get(CONTRACTS_STORAGE_KEY) ?? {};
    const storeAssets = Object.entries(_storedAssets).map(
      ([id, asset]) => ({
        id,
        ...(asset as Omit<Asset, 'id'>),
        value: Number(asset.value),
      }),
    );
    if (storeAssets.length)
      setAssets(current => [...current, ...storeAssets]);
  });

  const totalValue = () => {
    return filteredAssets().reduce((sum, asset) => sum + asset.value, 0);
  };

  const getTotalMediaCount = (asset: Asset) => {
    return (
      (asset.medias?.photos?.length || 0) +
      (asset.medias?.videos?.length || 0) +
      (asset.medias?.documents?.length || 0)
    );
  };

  return (
    <div class='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
      <div class='container mx-auto px-4 max-w-6xl'>
        <div class='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
          {/* Header */}
          <div class='mb-8'>
            <div class='flex justify-between items-center mb-4'>
              <div>
                <h1 class='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                  Liste des Assets
                </h1>
                <p class='text-gray-600 dark:text-gray-300'>
                  Gérez et consultez tous vos assets sur la blockchain
                </p>
              </div>
              <Link
                to='/contracts/create'
                class='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200'
              >
                Créer un Asset
              </Link>
            </div>

            {/* Stats */}
            <div class='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
              <div class='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg'>
                <div class='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  {filteredAssets().length}
                </div>
                <div class='text-sm text-gray-600 dark:text-gray-400'>
                  Assets totaux
                </div>
              </div>
              <div class='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                <div class='text-2xl font-bold text-green-600 dark:text-green-400'>
                  {displayNumber(totalValue().toString())} €
                </div>
                <div class='text-sm text-gray-600 dark:text-gray-400'>
                  Valeur totale
                </div>
              </div>
              <div class='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
                <div class='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                  {Math.round(
                    totalValue() / filteredAssets().length || 0,
                  ).toLocaleString()}{' '}
                  €
                </div>
                <div class='text-sm text-gray-600 dark:text-gray-400'>
                  Valeur moyenne
                </div>
              </div>
            </div>

            {/* Search */}
            <div class='mb-6'>
              <input
                type='text'
                placeholder='Rechercher un asset...'
                value={searchTerm()}
                onInput={e => setSearchTerm(e.currentTarget.value)}
                class='w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white'
              />
            </div>
          </div>

          {/* Assets List */}
          <div class='space-y-4'>
            <For each={filteredAssets()}>
              {asset => (
                <div class='border border-gray-200 dark:border-gray-600 rounded-lg p-6 hover:shadow-md transition-shadow duration-200'>
                  <div class='grid grid-cols-1 md:grid-cols-4 gap-4 items-start'>
                    {/* Asset Info */}
                    <div class='md:col-span-2'>
                      <div class='flex items-start justify-between mb-2'>
                        <h3 class='text-lg font-semibold text-gray-900 dark:text-white'>
                          {asset.description}
                        </h3>
                      </div>
                      <p class='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                        ID:{' '}
                        <code class='bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs'>
                          {asset.id}
                        </code>
                      </p>
                      <div class='flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                        <span>📷 {asset.medias?.photos?.length || 0}</span>
                        <span>🎥 {asset.medias?.videos?.length || 0}</span>
                        <span>
                          📄 {asset.medias?.documents?.length || 0}
                        </span>
                        <span class='text-gray-400'>|</span>
                        <span>
                          {getTotalMediaCount(asset)} média(s) total
                        </span>
                      </div>
                    </div>

                    {/* Value */}
                    <div class='text-center md:text-left'>
                      <div class='text-2xl font-bold text-gray-900 dark:text-white'>
                        {displayNumber(asset.value.toString())}
                      </div>
                      <div class='text-sm text-gray-500 dark:text-gray-400 uppercase'>
                        {asset.currency}
                      </div>
                    </div>

                    {/* Actions */}
                    <div class='flex gap-2 justify-end'>
                      <button class='px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
                        Voir
                      </button>
                      <button class='px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors'>
                        Éditer
                      </button>
                      <button class='px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors'>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </For>

            {/* Empty State */}
            <Show when={filteredAssets().length === 0}>
              <div class='text-center py-12'>
                <div class='text-gray-400 dark:text-gray-500 text-6xl mb-4'>
                  📦
                </div>
                <h3 class='text-xl font-semibold text-gray-900 dark:text-white mb-2'>
                  Aucun asset trouvé
                </h3>
                <p class='text-gray-600 dark:text-gray-400 mb-4'>
                  {searchTerm()
                    ? 'Aucun asset ne correspond à votre recherche.'
                    : "Vous n'avez pas encore créé d'asset."}
                </p>
                <Link
                  to='/contracts/create'
                  class='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200'
                >
                  Créer votre premier Asset
                </Link>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </div>
  );
}

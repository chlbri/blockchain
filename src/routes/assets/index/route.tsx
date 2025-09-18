import { createFileRoute, Link } from '@tanstack/solid-router';

import { CURRENCIES } from '#features/blockchain/back';
import { displayNumberS } from '#globals/front/helpers/numbers';
import { For, Show } from 'solid-js';
import { DeleteDialog } from './-components/DeleteDialog';
import { ViewSheet } from './-components/ViewSheet';
import { useHooks } from './-hooks';

export const Route = createFileRoute('/assets/')({
  component: AssetsPage,
});

function AssetsPage() {
  const {
    filtereds,
    totalValueS,
    searchTerm,
    setSearchTerm,
    mediaCount,
    length,
    median,
    deleteDialogOpen,
    viewSheetOpen,
    selectedAsset,
    openDeleteDialog,
    closeDeleteDialog,
    openViewSheet,
    closeViewSheet,
    deleteAsset,
  } = useHooks();

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
                  {length()}
                </div>
                <div class='text-sm text-gray-600 dark:text-gray-400'>
                  Assets
                </div>
              </div>
              <div class='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg'>
                <div class='text-2xl font-bold text-green-600 dark:text-green-400'>
                  {`${totalValueS()} ${CURRENCIES[0].display}`}
                </div>
                <div class='text-sm text-gray-600 dark:text-gray-400'>
                  Valeur totale
                </div>
              </div>
              <div class='bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg'>
                <div class='text-2xl font-bold text-purple-600 dark:text-purple-400'>
                  {`${median()} ${CURRENCIES[0].display}`}
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
            <For each={filtereds()}>
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
                        <span>{mediaCount(asset)}</span>
                      </div>
                    </div>

                    {/* Value */}
                    <div class='text-center md:text-left'>
                      <div class='text-2xl font-bold text-gray-900 dark:text-white'>
                        {displayNumberS(asset.value.toString())}
                      </div>
                      <div class='text-sm text-gray-500 dark:text-gray-400 uppercase'>
                        {asset.currency.display}
                      </div>
                    </div>

                    {/* Actions */}
                    <div class='flex gap-2 justify-end'>
                      <button
                        class='px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
                        onClick={() => openViewSheet(asset)}
                      >
                        Aperçu
                      </button>
                      <Link
                        to='/contracts/edit/$id'
                        params={{ id: asset.id }}
                        class='px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors inline-block'
                      >
                        Éditer
                      </Link>
                      <button
                        class='px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors'
                        onClick={() => openDeleteDialog(asset)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </For>

            {/* Empty State */}
            <Show when={length() === 0}>
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

      {/* Delete Dialog */}
      <DeleteDialog
        asset={selectedAsset()}
        isOpen={deleteDialogOpen()}
        onClose={closeDeleteDialog}
        onConfirm={deleteAsset}
      />

      {/* View Sheet */}
      <ViewSheet
        asset={selectedAsset()}
        isOpen={viewSheetOpen()}
        onClose={closeViewSheet}
      />
    </div>
  );
}

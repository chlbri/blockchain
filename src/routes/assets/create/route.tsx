import { createFileRoute } from '@tanstack/solid-router';
import { Currency } from './-components/Currency';
import { Medias } from './-components/Medias';
import { displayNumberS, retrieveNumberS, useHooks } from './-hooks';
import { start } from './-services/form';

export const Route = createFileRoute('/assets/create')({
  component: CreateAsset,
});

const currencies = [
  'EUR',
  'USD',
  'XOF (Francs CFA)',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
];

function CreateAsset() {
  start();

  const { send, select, handleSubmit, submitting } = useHooks();

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="container mx-auto px-4 max-w-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Créer un nouvel Asset
            </h1>
            <p class="text-gray-600 dark:text-gray-300">
              Remplissez les informations pour créer un nouvel asset sur la
              blockchain
            </p>
          </div>

          <form onSubmit={handleSubmit} class="space-y-6">
            {/* ID Field */}
            <div class="flex justify-evenly items-center">
              <button
                onClick={() => send('UPDATE_ID')}
                type="button"
                class="bg-slate-50 hover:bg-slate-100 items-center p-1 text-blue-600 hover:text-blue-800 font-medium rounded-full transition-all duration-200 active:scale-90 shadow-xl active:shadow-md cursor-pointer border-2 border-slate-200 group"
              >
                <svg
                  class="size-8 group-active:rotate-180 transition-all duration-200 ease-in-out"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2.5"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
              <label>
                ID de l'Asset :{' '}
                <span class="font-mono text-sm text-gray-500 dark:text-gray-400">
                  {select('context.id')()}
                </span>
              </label>
            </div>

            {/* Description Field */}
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={select('context.description')()}
                onInput={e =>
                  send({
                    type: 'UPDATE_DESCRIPTION',
                    payload: { description: e.currentTarget.value },
                  })
                }
                placeholder="Description détaillée de l'asset..."
                rows={4}
                class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical `}
              />
            </div>

            {/* Value and Currency Fields */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-full">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur *
                </label>
                <input
                  // type="number"
                  min={0}
                  value={displayNumberS(select('context.value')())}
                  // onInput={e => {
                  //   const value = retrieveNumberS(e.currentTarget.value);
                  //   send({
                  //     type: 'UPDATE_VALUE',
                  //     payload: { value },
                  //   });
                  // }}
                  onKeyPress={e => {
                    const value = retrieveNumberS(e.currentTarget.value);
                    send({
                      type: 'UPDATE_VALUE',
                      payload: { value },
                    });
                  }}
                  placeholder="10_000"
                  class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-10`}
                  classList={{
                    'border-red-500 focus:ring-red-500': !!select(
                      'context.errors.value',
                    )(),
                  }}
                />
                {select('context.errors.value')() && (
                  <p class="mt-1 text-sm text-red-500">
                    {select('context.errors.value')()}
                  </p>
                )}
              </div>

              <Currency
                currencies={currencies}
                current={select('context.currency')}
                setCurrent={value =>
                  send({
                    type: 'UPDATE_CURRENCY',
                    payload: { currency: value ?? 'EUR' },
                  })
                }
              />
            </div>

            {/* Media Section */}
            <div class="space-y-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Médias
              </h3>

              {/* Photos */}
              <Medias
                title="Photos"
                items={select('context.medias.photos')()}
                onAdd={value =>
                  send({
                    type: 'MEDIA_ADD',
                    payload: { type: 'photos', value },
                  })
                }
                onRemove={index =>
                  send({
                    type: 'MEDIA_REMOVE',
                    payload: { type: 'photos', index },
                  })
                }
                placeholder="URL de la photo"
              />

              {/* Videos */}
              <Medias
                title="Vidéos"
                items={select('context.medias.videos')()}
                onAdd={value =>
                  send({
                    type: 'MEDIA_ADD',
                    payload: { type: 'videos', value },
                  })
                }
                onRemove={index =>
                  send({
                    type: 'MEDIA_REMOVE',
                    payload: { type: 'videos', index },
                  })
                }
                placeholder="URL de la vidéo"
              />

              {/* Documents */}
              <Medias
                title="Documents"
                items={select('context.medias.documents')()}
                onAdd={value =>
                  send({
                    type: 'MEDIA_ADD',
                    payload: { type: 'documents', value },
                  })
                }
                onRemove={index =>
                  send({
                    type: 'MEDIA_REMOVE',
                    payload: { type: 'documents', index },
                  })
                }
                placeholder="URL du document"
              />
            </div>

            {/* Submit Button */}
            <div class="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={submitting()}
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {submitting() ? 'Création...' : "Créer l'Asset"}
              </button>

              <button
                type="button"
                onClick={() => send('RESET')}
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

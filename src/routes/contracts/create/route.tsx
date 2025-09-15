import { ButtonUpdate } from '#components/atoms/ButtonUpdate';
import { AmountInput } from '#components/organisms/AmountInput';
import { createFileRoute } from '@tanstack/solid-router';
import { deepEqual } from 'fast-equals';
import { For } from 'solid-js';
import { CURRENCIES } from 'src/features/blockchain/back';
import { Currency } from './-components/Currency';
import { Medias } from './-components/Medias';
import { useHooks } from './-hooks';
import { start } from './-services/form';

export const Route = createFileRoute('/contracts/create')({
  component: () => {
    start();
    const { send, select, handleSubmit, submitting } = useHooks();

    return (
      <div class='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
        <div class='container mx-auto px-4 max-w-2xl'>
          <div class='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
            <div class='mb-8'>
              <h1 class='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                Créer un nouvel Asset
              </h1>
              <p class='text-gray-600 dark:text-gray-300'>
                Remplissez les informations pour créer un nouvel asset sur
                la blockchain
              </p>
            </div>

            <form class='space-y-6'>
              {/* ID Field */}
              <div class='flex justify-evenly items-center'>
                <ButtonUpdate
                  onClick={() => send('UPDATE_ID')}
                  size='small'
                />

                <label>
                  ID de l'Asset :{' '}
                  <span class='font-mono text-sm text-gray-500 dark:text-gray-400'>
                    {select('context.id', deepEqual)()}
                  </span>
                </label>
              </div>

              {/* Description Field */}
              <div>
                <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
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
              <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <AmountInput
                  class='h-full'
                  label='Valeur'
                  required
                  value={select('context.value', deepEqual)}
                  onInput={value => {
                    send({
                      type: 'UPDATE_VALUE',
                      payload: { value },
                    });
                  }}
                  placeholder={() => '10_000'}
                  error={select('context.errors.value')}
                />

                <Currency
                  currencies={CURRENCIES}
                  current={select('context.currency', deepEqual)}
                  setCurrent={value =>
                    send({
                      type: 'UPDATE_CURRENCY',
                      payload: { currency: value ?? CURRENCIES[0] },
                    })
                  }
                />
              </div>

              {/* Media Section */}
              <div class='space-y-6'>
                <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
                  Médias
                </h3>

                <For each={['photos', 'videos', 'documents'] as const}>
                  {type => (
                    <Medias
                      title={`${type.charAt(0).toUpperCase()}${type.slice(1)}`}
                      items={select(`context.medias.${type}`, deepEqual)()}
                      onAdd={value =>
                        send({
                          type: 'MEDIA_ADD',
                          payload: { type, value },
                        })
                      }
                      onRemove={index =>
                        send({
                          type: 'MEDIA_REMOVE',
                          payload: { type, index },
                        })
                      }
                      placeholder={`URL de la ${type.slice(0, -1)}`}
                    />
                  )}
                </For>
              </div>

              <div class='flex gap-4 pt-6'>
                {/* Submit Button */}
                <button
                  type='button'
                  disabled={submitting()}
                  class='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer'
                  onClick={handleSubmit}
                >
                  {submitting() ? 'Création...' : "Créer l'Asset"}
                </button>

                <button
                  type='button'
                  onClick={() => send('RESET')}
                  class='px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
                >
                  Réinitialiser
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});

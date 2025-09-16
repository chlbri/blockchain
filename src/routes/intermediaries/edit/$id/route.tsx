import { createFileRoute } from '@tanstack/solid-router';
import { deepEqual } from 'fast-equals';
import { Show } from 'solid-js';
import { CompanyFields } from '../../create/-components/CompanyFields';
import { IndividualFields } from '../../create/-components/IndividualFields';
import { PersonalitySelector } from '../../create/-components/PersonalitySelector';
import { useHooks } from './-hooks';

export const Route = createFileRoute('/intermediaries/edit/$id')({
  component: () => {
    const id = Route.useParams({ select: ({ id }) => id });

    const { send, select, handleSubmit, submitting, context } =
      useHooks(id());

    return (
      <div class='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
        <div class='container mx-auto px-4 max-w-2xl'>
          <div class='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
            <div class='mb-8'>
              <h1 class='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                Modifier l'Intermédiaire
              </h1>
              <p class='text-gray-600 dark:text-gray-300'>
                Modifiez les informations de l'intermédiaire sur la
                blockchain
              </p>
            </div>

            <form class='space-y-6'>
              {/* ID Field - Read Only */}
              <div class='flex justify-evenly items-center'>
                <label>
                  ID de l'Intermédiaire :{' '}
                  <span class='font-mono text-sm text-gray-500 dark:text-gray-400'>
                    {select('context.id', deepEqual)()}
                  </span>
                </label>
              </div>

              {/* Personality Selector */}
              <PersonalitySelector
                value={
                  select('context.personality', deepEqual)() ||
                  'individual'
                }
                onChange={personality =>
                  send({
                    type: 'UPDATE_PERSONALITY',
                    payload: { personality },
                  })
                }
              />

              {/* Wallet Fields */}
              <div>
                <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Wallet *
                </label>
                <input
                  type='text'
                  value={select('context.wallet', deepEqual)() || ''}
                  onInput={e =>
                    send({
                      type: 'UPDATE_WALLET',
                      payload: { wallet: e.currentTarget.value },
                    })
                  }
                  placeholder='Adresse wallet...'
                  class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                />
              </div>

              {/* Individual or Company Fields */}
              <Show
                when={context(
                  ({ personality }) => personality === 'individual',
                )()}
              >
                <IndividualFields
                  firstName={
                    select('context.firstName', deepEqual)() || ''
                  }
                  lastName={select('context.lastName', deepEqual)() || ''}
                  nationalID={
                    select('context.nationalID', deepEqual)() || ''
                  }
                  onFirstNameChange={value =>
                    send({
                      type: 'UPDATE_FIRST_NAME',
                      payload: { firstName: value },
                    })
                  }
                  onLastNameChange={value =>
                    send({
                      type: 'UPDATE_LAST_NAME',
                      payload: { lastName: value },
                    })
                  }
                  onNationalIdChange={value =>
                    send({
                      type: 'UPDATE_NATIONAL_ID',
                      payload: { nationalID: value },
                    })
                  }
                  errors={{
                    firstName: select(
                      'context.errors.firstName',
                      deepEqual,
                    )(),
                    lastName: select(
                      'context.errors.lastName',
                      deepEqual,
                    )(),
                    nationalID: select(
                      'context.errors.nationalID',
                      deepEqual,
                    )(),
                  }}
                />
              </Show>

              <Show
                when={context(
                  ({ personality }) => personality === 'company',
                )()}
              >
                <CompanyFields
                  companyName={
                    select('context.companyName', deepEqual)() || ''
                  }
                  registrationNumber={
                    select('context.registrationNumber', deepEqual)() || ''
                  }
                  onCompanyNameChange={value =>
                    send({
                      type: 'UPDATE_COMPANY_NAME',
                      payload: { companyName: value },
                    })
                  }
                  onRegistrationNumberChange={value =>
                    send({
                      type: 'UPDATE_REGISTRATION_NUMBER',
                      payload: { registrationNumber: value },
                    })
                  }
                  errors={{
                    companyName: select(
                      'context.errors.companyName',
                      deepEqual,
                    )(),
                    registrationNumber: select(
                      'context.errors.registrationNumber',
                      deepEqual,
                    )(),
                  }}
                />
              </Show>

              {/* Contact Fields - Simplified for edit */}
              <div class='space-y-4'>
                <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
                  Contacts
                </h3>

                {/* Phone Numbers */}
                <div>
                  <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Numéros de téléphone
                  </label>
                  <textarea
                    value={JSON.stringify(
                      select('context.phoneNumbers', deepEqual)() || [],
                      null,
                      2,
                    )}
                    onInput={e => {
                      try {
                        const phoneNumbers = JSON.parse(
                          e.currentTarget.value,
                        );
                        send({
                          type: 'UPDATE_PHONE_NUMBERS',
                          payload: { phoneNumbers },
                        });
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='[]'
                    rows={3}
                    class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm'
                  />
                </div>

                {/* Emails */}
                <div>
                  <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                    Emails
                  </label>
                  <textarea
                    value={JSON.stringify(
                      select('context.emails', deepEqual)() || [],
                      null,
                      2,
                    )}
                    onInput={e => {
                      try {
                        const emails = JSON.parse(e.currentTarget.value);
                        send({
                          type: 'UPDATE_EMAILS',
                          payload: { emails },
                        });
                      } catch {
                        // Invalid JSON, ignore
                      }
                    }}
                    placeholder='[]'
                    rows={2}
                    class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm'
                  />
                </div>
              </div>

              <div class='flex gap-4 pt-6'>
                {/* Submit Button */}
                <button
                  type='button'
                  disabled={submitting()}
                  class='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer'
                  onClick={handleSubmit}
                >
                  {submitting()
                    ? 'Modification...'
                    : "Modifier l'Intermédiaire"}
                </button>

                <button
                  type='button'
                  onClick={() => {
                    send('RESET');
                  }}
                  class='px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200'
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  },
});

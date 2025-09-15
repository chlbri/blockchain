import { ButtonUpdate } from '#components/atoms/ButtonUpdate';
import { createFileRoute } from '@tanstack/solid-router';
import { deepEqual } from 'fast-equals';
import { Show } from 'solid-js';
import { CompanyFields } from './-components/CompanyFields';
import { ContactFields } from './-components/ContactFields';
import { IndividualFields } from './-components/IndividualFields';
import { PersonalitySelector } from './-components/PersonalitySelector';
import { WalletFields } from './-components/WalletFields';
import { useHooks } from './-hooks';
import { context, start } from './-services/form';

export const Route = createFileRoute('/intermediaries/create')({
  component: () => {
    start();
    const { send, select, handleSubmit, submitting } = useHooks();

    return (
      <div class='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
        <div class='container mx-auto px-4 max-w-2xl'>
          <div class='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8'>
            <div class='mb-8'>
              <h1 class='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                Créer un nouvel Intermédiaire
              </h1>
              <p class='text-gray-600 dark:text-gray-300'>
                Remplissez les informations pour créer un nouvel
                intermédiaire sur la blockchain
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
              <WalletFields />

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

              {/* Contact Fields */}
              <ContactFields
                phoneNumbers={
                  select('context.contacts.phoneNumbers', deepEqual)() ||
                  []
                }
                emails={
                  select('context.contacts.emails', deepEqual)() || []
                }
                socials={
                  select('context.contacts.socials', deepEqual)() || {}
                }
                websites={
                  select('context.contacts.websites', deepEqual)() || []
                }
                onAddPhone={(countryCode, number) =>
                  send({
                    type: 'ADD_PHONE_NUMBER',
                    payload: { countryCode, number },
                  })
                }
                onUpdatePhone={(index, phone) =>
                  send({
                    type: 'UPDATE_PHONE_NUMBER',
                    payload: { index, phoneNumber: phone },
                  })
                }
                onRemovePhone={index =>
                  send({
                    type: 'REMOVE_PHONE_NUMBER',
                    payload: { index },
                  })
                }
                onAddEmail={email =>
                  send({
                    type: 'ADD_EMAIL',
                    payload: { email },
                  })
                }
                onUpdateEmail={(index, email) =>
                  send({
                    type: 'UPDATE_EMAIL',
                    payload: { index, email },
                  })
                }
                onRemoveEmail={index =>
                  send({
                    type: 'REMOVE_EMAIL',
                    payload: { index },
                  })
                }
                onAddSocial={(platform, url) =>
                  send({
                    type: 'ADD_SOCIAL',
                    payload: { platform, url },
                  })
                }
                onUpdateSocial={(platform, url) =>
                  send({
                    type: 'UPDATE_SOCIAL',
                    payload: { platform, url },
                  })
                }
                onRemoveSocial={platform =>
                  send({
                    type: 'REMOVE_SOCIAL',
                    payload: { platform },
                  })
                }
                onAddWebsite={website =>
                  send({
                    type: 'ADD_WEBSITE',
                    payload: { website },
                  })
                }
                onUpdateWebsite={(index, website) =>
                  send({
                    type: 'UPDATE_WEBSITE',
                    payload: { index, website },
                  })
                }
                onRemoveWebsite={index =>
                  send({
                    type: 'REMOVE_WEBSITE',
                    payload: { index },
                  })
                }
                errors={{
                  phoneNumbers: select(
                    'context.errors.phoneNumbers',
                    deepEqual,
                  )(),
                  emails: select('context.errors.email', deepEqual)(),
                }}
              />

              <div class='flex gap-4 pt-6'>
                {/* Submit Button */}
                <button
                  type='button'
                  disabled={submitting()}
                  class='flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed cursor-pointer'
                  onClick={handleSubmit}
                >
                  {/* {submitting() ? 'Création...' : "Créer l'Intermédiaire"} */}
                  Créer l'Intermédiaire
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

import { createMachine, typings } from '@bemedev/app-ts';
import { SCHEMAS } from './machine.machine.gen';
import type { Asset, Intermediary } from './types';

export const machine = createMachine(
  {
    initial: 'idle',
    __tsSchema: SCHEMAS.machine.__tsSchema,
    states: {
      idle: {
        on: {
          START: [
            {
              target: '/checking',
              description: 'Start the machine',
              guards: { and: ['assetIsDefined', 'mandatoryIsDefined'] },
              actions: [
                'provideAsset',
                'addMandatoryIntermediary',
                {
                  name: 'addBlockImmoIntermediary',
                  description:
                    'BLOCK_IMMO is here the second intermediary',
                },
              ],
            },
            {
              target: '/checking',
              description: 'Start the machine',
              guards: 'assetIsDefined',
              actions: [
                'provideAsset',
                {
                  name: 'addBlockImmoIntermediary',
                  description: 'BLOCK_IMMO is the first intermediary',
                },
              ],
            },
          ],
        },
      },
      checking: {
        promises: [
          {
            src: 'checkOnline',
            description: 'Check if we are online',
            then: {
              actions: 'setOnlineStatus',
            },
            catch: {
              target: '/idle',
              actions: 'setOfflineStatus',
            },
          },
          {
            src: 'getIntermediaries',
            description: 'Fetch intermediaries from the blockchain',
            then: {
              target: '/working',
              actions: 'addIntermediaries',
            },
            catch: {
              target: '/idle',
              actions: {
                name: 'setIntermediariesQueryError',
                description: 'Failed to fetch intermediaries',
              },
            },
          },
        ],
      },
      working: {
        initial: 'idle',
        states: {
          idle: {
            on: {
              ADD_INTERMEDIARY: {
                description: 'Add an intermediary',
                guards: {
                  and: [
                    {
                      name: 'intermediariesAreNotFull',
                      description: 'Max 3/5/7 intermediaries',
                    },
                    'intermediaryIsNotAdded',
                  ],
                },
                target: '/working/adding',
              },
            },
          },
          adding: {
            promises: [
              {
                src: 'checkOnline',
                description: 'Check if we are online',
                then: {
                  actions: 'setOnlineStatus',
                },
                catch: {
                  target: '/working/idle',
                  actions: 'setOfflineStatus',
                },
              },
              {
                src: 'addIntermediary',
                description: 'Add the intermediary to the blockchain',
                then: {
                  target: '/working/idle',
                  actions: ['addIntermediary', 'end.add'],
                },
                catch: {
                  target: '/working/idle',
                  actions: [
                    {
                      name: 'setAddIntermediaryError',
                      description: 'Failed to add the intermediary',
                    },
                    'end.error.add',
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  typings({
    eventsMap: {
      START: typings.partial({
        asset: typings.custom<Asset>(),
        mandatory: typings.custom<Intermediary>(),
      }),
      ADD_INTERMEDIARY: typings.custom<Intermediary>(),
    },
    context: typings.partial({
      asset: typings.custom<Asset>(),
      intermediaries: [typings.custom<Intermediary>()],
      internetStatus: 'boolean',
    }),
  }),
).provideOptions(({ assign }) => ({
  actions: {
    provideAsset: assign('context.asset', {
      START: ({ payload }) => payload.asset,
    }),

    addMandatoryIntermediary: assign('context.intermediaries', {
      START: ({ payload }) => [payload.mandatory!],
    }),

    addBlockImmoIntermediary: assign('context.intermediaries', {
      START: ({ context: { intermediaries = [] } }) => [
        ...intermediaries /*, TODO: Add BLOCK_IMMO intermediary */,
      ],
    }),
  },
  predicates: {
    assetIsDefined: {
      START: ({ payload }) => !!payload.asset,
    },
    mandatoryIsDefined: {
      START: ({ payload }) => !!payload.mandatory,
    },
  },
}));

import type { Asset } from '#types';
import { createMachine, typings } from '@bemedev/app-ts';
import ls from 'localstorage-slim';
import { SCHEMAS } from './-machine.machine.gen';
import { CONTRACTS_STORAGE_KEY, DEFAULT_CONTRACT } from './constants';

type Media = keyof Asset['medias'];
const type = typings.custom<Media>();

export const machine = createMachine(
  {
    initial: 'idle',
    __tsSchema: SCHEMAS.machine.__tsSchema,
    states: {
      idle: {
        on: {
          SET_ID: {
            actions: ['setId', 'build'],
            description: 'Set the asset ID',
            target: '/working',
          },
        },
      },
      working: {
        on: {
          RESET: {
            actions: ['reset', 'end'],
            target: '/idle',
            description: 'Reset the form',
          },

          UPDATE_DESCRIPTION: {
            actions: 'updateDescription',
            description: 'Update the description',
          },

          UPDATE_VALUE: {
            actions: ['updateValue', 'validateValue'],
            description: 'Update the value',
          },

          UPDATE_CURRENCY: {
            actions: 'updateCurrency',
            description: 'Update the currency',
          },

          MEDIA_ADD: {
            actions: 'mediaAdd',
            description: 'Add media',
          },

          MEDIA_REMOVE: {
            actions: 'mediaRemove',
            description: 'Remove media',
          },

          MEDIA_UPDATE: {
            actions: 'mediaUpdate',
            description: 'Update media',
          },
        },

        initial: 'stable',

        states: {
          stable: {
            on: {
              SUBMIT: {
                actions: ['validate'],
                target: '/working/submitting',
              },
            },
          },

          submitting: {
            promises: {
              src: 'submit',
              then: { target: '/idle' },
              catch: { target: '/idle' },
              finally: ['end'],
              description: 'Submitting the asset form',
              max: 'MAX_DURATION',
            },
            exit: 'reset',
          },
        },
      },
    },
  },
  typings({
    context: typings.partial({
      id: 'string',
      description: 'string',
      value: 'string',
      currency: 'string',

      medias: typings.partial({
        photos: typings.custom<string[]>(),
        videos: typings.custom<string[]>(),
        documents: typings.custom<string[]>(),
      }),

      errors: typings.partial({
        value: 'string',
      }),
    }),

    eventsMap: {
      SET_ID: { id: 'string' },
      UPDATE_ID: 'primitive',
      UPDATE_DESCRIPTION: { description: 'string' },
      UPDATE_VALUE: { value: 'string' },
      UPDATE_CURRENCY: typings.partial({ currency: 'string' }),
      MEDIA_ADD: { type, value: 'string' },
      MEDIA_REMOVE: { type, index: 'number' },
      MEDIA_UPDATE: { type, index: 'number', value: 'string' },
      SUBMIT: 'primitive',
      RESET: 'primitive',
    },
  }),
).provideOptions(({ assign }) => ({
  actions: {
    setId: assign('context.id', {
      SET_ID: ({ payload }) => payload.id,
    }),
    build: assign('context', ({ context: { id } }) => {
      // Load existing asset data
      const stored = ls.get(CONTRACTS_STORAGE_KEY) ?? {};
      const existingAsset = (stored as Record<string, any>)[id!];

      console.log(
        'Loaded existing asset from localStorage:',
        existingAsset,
      );

      if (existingAsset) {
        return {
          ...existingAsset,
          value: existingAsset.value,
          errors: {},
        };
      }
      return {
        ...DEFAULT_CONTRACT,
        errors: {},
      };
    }),
    reset: assign('context', () => ({
      ...DEFAULT_CONTRACT,
      errors: {},
    })),

    updateDescription: assign('context.description', {
      UPDATE_DESCRIPTION: ({ payload }) => payload.description,
    }),

    updateValue: assign('context.value', {
      UPDATE_VALUE: ({ payload }) => payload.value,
    }),
    validateValue: assign('context.errors', ({ context }) => {
      const errors: Record<string, string> = { ...context.errors };
      const value = Number(
        context.value?.replaceAll(',', '').replaceAll('.', ''),
      );
      if (value < 0) {
        errors.value = 'La valeur doit être un nombre positif';
      } else {
        delete errors.value;
      }
      return errors;
    }),

    updateCurrency: assign('context.currency', {
      UPDATE_CURRENCY: ({ payload }) => payload.currency,
    }),

    mediaAdd: assign('context.medias', {
      MEDIA_ADD: ({ payload, context }) => {
        const { type, value } = payload;
        if (value.trim() === '') return context.medias;

        return {
          ...context.medias,
          [type]: [...context.medias![type]!, value.trim()],
        };
      },
    }),

    mediaUpdate: assign('context.medias', {
      MEDIA_UPDATE: ({ payload, context }) => {
        const { type, index, value } = payload;
        return {
          ...context.medias,
          [type]: context.medias![type]!.map((item, i) =>
            i === index ? value : item,
          ),
        };
      },
    }),

    mediaRemove: assign('context.medias', {
      MEDIA_REMOVE: ({ payload, context }) => {
        const { type, index } = payload;
        return {
          ...context.medias,
          [type]: context.medias![type]!.filter(
            (_: string, i: number) => i !== index,
          ),
        };
      },
    }),

    validate: assign('context.errors', ({ context }) => {
      return Object.keys(context.errors!).length === 0;
    }),
  },

  delays: {
    MAX_DURATION: 10000,
  },
}));

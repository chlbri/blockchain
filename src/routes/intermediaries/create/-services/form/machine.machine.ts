import type { Personality } from '#features/blockchain/back';
import { createMachine, typings } from '@bemedev/app-ts';
import { nanoid } from 'nanoid';
import { SCHEMAS } from './machine.machine.gen';
import { DEFAULT_INTERMEDIARY } from './constants';

export const machine = createMachine(
  {
    initial: 'idle',
    __tsSchema: SCHEMAS.machine.__tsSchema,
    states: {
      idle: {
        always: {
          target: '/working',
          actions: 'reset',
          description: 'Initialize form data',
        },
      },
      working: {
        on: {
          UPDATE_ID: {
            actions: 'updateId',
            description: 'Generate a new ID',
          },

          RESET: {
            actions: ['reset'],
          },

          UPDATE_WALLET: {
            actions: 'updateWallet',
            description: 'Update the wallet address',
          },

          UPDATE_SACRIFICE: {
            actions: 'updateSacrifice',
            description: 'Update the sacrifice amount',
          },

          UPDATE_PERSONALITY: {
            actions: 'updatePersonality',
            description: 'Update the personality type',
          },

          // Individual fields
          UPDATE_FIRST_NAME: {
            actions: 'updateFirstName',
            description: 'Update the first name',
          },

          UPDATE_LAST_NAME: {
            actions: 'updateLastName',
            description: 'Update the last name',
          },

          UPDATE_NATIONAL_ID: {
            actions: 'updateNationalId',
            description: 'Update the national ID',
          },

          // Company fields
          UPDATE_COMPANY_NAME: {
            actions: 'updateCompanyName',
            description: 'Update the company name',
          },

          UPDATE_REGISTRATION_NUMBER: {
            actions: 'updateRegistrationNumber',
            description: 'Update the registration number',
          },

          // Contact fields
          ADD_PHONE_NUMBER: {
            actions: 'addPhoneNumber',
            description: 'Add a phone number',
          },

          UPDATE_PHONE_NUMBER: {
            actions: 'updatePhoneNumber',
            description: 'Update a phone number',
          },

          REMOVE_PHONE_NUMBER: {
            actions: 'removePhoneNumber',
            description: 'Remove a phone number',
          },

          ADD_EMAIL: {
            actions: 'addEmail',
            description: 'Add an email',
          },

          UPDATE_EMAIL: {
            actions: 'updateEmail',
            description: 'Update an email',
          },

          REMOVE_EMAIL: {
            actions: 'removeEmail',
            description: 'Remove an email',
          },

          ADD_SOCIAL: {
            actions: 'addSocial',
            description: 'Add a social media link',
          },

          UPDATE_SOCIAL: {
            actions: 'updateSocial',
            description: 'Update a social media link',
          },

          REMOVE_SOCIAL: {
            actions: 'removeSocial',
            description: 'Remove a social media link',
          },

          ADD_WEBSITE: {
            actions: 'addWebsite',
            description: 'Add a website',
          },

          UPDATE_WEBSITE: {
            actions: 'updateWebsite',
            description: 'Update a website',
          },

          REMOVE_WEBSITE: {
            actions: 'removeWebsite',
            description: 'Remove a website',
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
              catch: { target: '/working/stable' },
              description: 'Submitting the intermediary form',
              max: 'MAX_DURATION',
            },
            exit: 'reset',
          },
        },
      },
    },
  },
  typings({
    eventsMap: {
      UPDATE_ID: 'primitive',
      RESET: 'primitive',
      UPDATE_WALLET: { wallet: 'string' },
      UPDATE_SACRIFICE: { sacrifice: 'string' },
      UPDATE_PERSONALITY: { personality: typings.custom<Personality>() },
      UPDATE_FIRST_NAME: { firstName: 'string' },
      UPDATE_LAST_NAME: { lastName: 'string' },
      UPDATE_NATIONAL_ID: { nationalID: 'string' },
      UPDATE_COMPANY_NAME: { companyName: 'string' },
      UPDATE_REGISTRATION_NUMBER: { registrationNumber: 'string' },
      ADD_PHONE_NUMBER: {
        countryCode: 'number',
        number: 'number',
      },
      UPDATE_PHONE_NUMBER: {
        index: 'number',
        phoneNumber: typings.partial({
          countryCode: 'number',
          number: 'number',
        }),
      },
      REMOVE_PHONE_NUMBER: { index: 'number' },
      ADD_EMAIL: { email: 'string' },
      UPDATE_EMAIL: { index: 'number', email: 'string' },
      REMOVE_EMAIL: { index: 'number' },
      ADD_SOCIAL: { platform: 'string', url: 'string' },
      UPDATE_SOCIAL: {
        platform: 'string',
        url: 'string',
      },
      REMOVE_SOCIAL: { platform: 'string' },
      ADD_WEBSITE: { website: 'string' },
      UPDATE_WEBSITE: { index: 'number', website: 'string' },
      REMOVE_WEBSITE: { index: 'number' },
      SUBMIT: 'primitive',
      MEDIA_UPDATE: { type: 'string', index: 'number', value: 'string' },
    },

    context: typings.partial({
      id: 'string',
      wallet: 'string',
      sacrifice: 'string',
      personality: typings.custom<Personality>(),
      firstName: 'string',
      lastName: 'string',
      nationalID: 'string',
      companyName: 'string',
      registrationNumber: 'string',

      contacts: typings.partial({
        phoneNumbers:
          typings.custom<{ countryCode: number; number: number }[]>(),
        emails: typings.custom<string[]>(),
        socials: typings.custom<Record<string, string>>(),
        websites: typings.custom<string[]>(),
      }),

      errors: typings.partial({
        wallet: 'string',
        personality: 'string',
        firstName: 'string',
        lastName: 'string',
        nationalID: 'string',
        companyName: 'string',
        registrationNumber: 'string',
        phoneNumbers: 'string',
        email: 'string',
      }),
    }),
  }),
).provideOptions(({ assign }) => ({
  actions: {
    reset: assign('context', () => ({
      ...DEFAULT_INTERMEDIARY,
      id: nanoid(),
    })),

    updateId: assign('context.id', () => nanoid()),

    updateWallet: assign('context.wallet', {
      UPDATE_WALLET: ({ payload }) => payload.wallet,
    }),

    updateSacrifice: assign('context.sacrifice', {
      UPDATE_SACRIFICE: ({ payload }) => payload.sacrifice,
    }),

    updatePersonality: assign('context.personality', {
      UPDATE_PERSONALITY: ({ payload }) => payload.personality,
    }),

    updateFirstName: assign('context.firstName', {
      UPDATE_FIRST_NAME: ({ payload }) => payload.firstName,
    }),

    updateLastName: assign('context.lastName', {
      UPDATE_LAST_NAME: ({ payload }) => payload.lastName,
    }),

    updateNationalId: assign('context.nationalID', {
      UPDATE_NATIONAL_ID: ({ payload }) => payload.nationalID,
    }),

    updateCompanyName: assign('context.companyName', {
      UPDATE_COMPANY_NAME: ({ payload }) => payload.companyName,
    }),

    updateRegistrationNumber: assign('context.registrationNumber', {
      UPDATE_REGISTRATION_NUMBER: ({ payload }) =>
        payload.registrationNumber,
    }),

    addPhoneNumber: assign('context.contacts.phoneNumbers', {
      ADD_PHONE_NUMBER: ({ payload, context }) => [
        ...(context.contacts?.phoneNumbers || []),
        payload,
      ],
    }),

    updatePhoneNumber: assign('context.contacts.phoneNumbers', {
      UPDATE_PHONE_NUMBER: ({
        payload: { index, phoneNumber },
        context,
      }) =>
        context.contacts?.phoneNumbers?.map((phone, i) =>
          i === index ? phoneNumber : phone,
        ),
    }),

    removePhoneNumber: assign('context.contacts.phoneNumbers', {
      REMOVE_PHONE_NUMBER: ({ payload, context }) =>
        context.contacts?.phoneNumbers?.filter(
          (_, index) => index !== payload.index,
        ),
    }),

    addEmail: assign('context.contacts.emails', {
      ADD_EMAIL: ({ payload, context }) => [
        ...(context.contacts?.emails || []),
        payload,
      ],
    }),

    updateEmail: assign('context.contacts.emails', {
      UPDATE_EMAIL: ({ payload, context }) =>
        context.contacts?.emails?.map((email, i) =>
          i === payload.index ? payload.email : email,
        ),
    }),

    removeEmail: assign('context.contacts.emails', {
      REMOVE_EMAIL: ({ payload, context }) =>
        context.contacts?.emails?.filter(
          (_, index) => index !== payload.index,
        ),
    }),

    addSocial: assign('context.contacts.socials', {
      ADD_SOCIAL: ({ payload, context }) => {
        const _default = context.contacts?.socials || {};
        return {
          ..._default,
          [payload.platform]: payload.url,
        };
      },
    }),

    updateSocial: assign('context.contacts.socials', {
      UPDATE_SOCIAL: ({ payload, context }) => {
        const _default = context.contacts?.socials || {};
        return {
          ..._default,
          [payload.platform]: payload.url,
        };
      },
    }),

    removeSocial: assign('context.contacts.socials', {
      REMOVE_SOCIAL: ({ payload, context }) => {
        const _default = context.contacts?.socials || {};
        return {
          ...(_default || {}),
          [payload.platform]: undefined,
        };
      },
    }),

    addWebsite: assign('context.contacts.websites', {
      ADD_WEBSITE: ({ payload, context }) => {
        const _default = context.contacts?.websites || [];
        return [..._default, payload.website];
      },
    }),

    updateWebsite: assign('context.contacts.websites', {
      UPDATE_WEBSITE: ({ payload, context }) =>
        context.contacts?.websites?.map((website, index) =>
          index === payload.index ? payload.website : website,
        ),
    }),

    removeWebsite: assign('context.contacts.websites', {
      REMOVE_WEBSITE: ({ payload, context }) =>
        context.contacts?.websites?.filter(
          (_: string, index: number) => index !== payload.index,
        ),
    }),

    validate: assign('context.errors', ({ context }) => {
      const errors: any = {};

      if (!context?.wallet) errors.wallet = 'Wallet is required';
      if (!context?.personality)
        errors.personality = 'Personality is required';

      if (context.personality == 'individual') {
        if (!context?.firstName)
          errors.firstName = 'First Name is required';
      }

      if (context.personality == 'company') {
        if (!context?.companyName)
          errors.companyName = 'companyName is required';

        if (!context.registrationNumber)
          errors.registrationNumber = 'Registration Number is required';

        //check at least one email
        if (
          !context?.contacts?.emails ||
          context.contacts.emails.length < 1
        )
          errors.email = 'At least one email is required for company';
      }

      if (!context?.nationalID)
        errors.nationalID = 'National ID is required';

      //check at least one phoneNumber
      if (
        !context?.contacts?.phoneNumbers ||
        context.contacts.phoneNumbers.length < 1
      )
        errors.phoneNumbers = 'At least one phone number is required';

      return errors;
    }),
  },
  delays: {
    MAX_DURATION: 100_000,
  },
}));

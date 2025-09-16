import { createMachine, typings } from '@bemedev/app-ts';
import ls from 'localstorage-slim';
import { DEFAULT_INTERMEDIARY } from 'src/routes/intermediaries/create/-services/form/constants';
import { SCHEMAS } from './-machine.machine.gen';

export const machine = createMachine(
  {
    initial: 'idle',
    __tsSchema: SCHEMAS.machine.__tsSchema,
    states: {
      idle: {
        on: {
          SET_ID: {
            actions: ['setId', 'build'],
            description: 'Set the intermediary ID',
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

          UPDATE_ID: {
            actions: 'updateId',
            description: 'Update the ID',
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
            description: 'Update first name',
          },

          UPDATE_LAST_NAME: {
            actions: 'updateLastName',
            description: 'Update last name',
          },

          UPDATE_NATIONAL_ID: {
            actions: 'updateNationalId',
            description: 'Update national ID',
          },

          // Company fields
          UPDATE_COMPANY_NAME: {
            actions: 'updateCompanyName',
            description: 'Update company name',
          },

          UPDATE_REGISTRATION_NUMBER: {
            actions: 'updateRegistrationNumber',
            description: 'Update registration number',
          },

          // Contacts
          UPDATE_PHONE_NUMBERS: {
            actions: 'updatePhoneNumbers',
            description: 'Update phone numbers',
          },

          UPDATE_EMAILS: {
            actions: 'updateEmails',
            description: 'Update emails',
          },

          UPDATE_SOCIALS: {
            actions: 'updateSocials',
            description: 'Update socials',
          },

          UPDATE_WEBSITES: {
            actions: 'updateWebsites',
            description: 'Update websites',
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
    context: typings.partial({
      id: 'string',
      wallet: 'string',
      sacrifice: 'number',
      personality: typings.custom<'individual' | 'company'>(),
      // Individual
      firstName: 'string',
      lastName: 'string',
      nationalID: 'string',
      // Company
      companyName: 'string',
      registrationNumber: 'string',
      // Contacts
      phoneNumbers: typings.custom<any[]>(),
      emails: typings.custom<string[]>(),
      socials: typings.custom<any[]>(),
      websites: typings.custom<string[]>(),
      errors: typings.partial({
        wallet: 'string',
        firstName: 'string',
        lastName: 'string',
        nationalID: 'string',
        companyName: 'string',
        registrationNumber: 'string',
      }),
    }),

    eventsMap: {
      SET_ID: { id: 'string' },
      UPDATE_ID: 'primitive',
      UPDATE_WALLET: { wallet: 'string' },
      UPDATE_SACRIFICE: { sacrifice: 'number' },
      UPDATE_PERSONALITY: {
        personality: typings.custom<'individual' | 'company'>(),
      },
      UPDATE_FIRST_NAME: { firstName: 'string' },
      UPDATE_LAST_NAME: { lastName: 'string' },
      UPDATE_NATIONAL_ID: { nationalID: 'string' },
      UPDATE_COMPANY_NAME: { companyName: 'string' },
      UPDATE_REGISTRATION_NUMBER: { registrationNumber: 'string' },
      UPDATE_PHONE_NUMBERS: { phoneNumbers: typings.custom<any[]>() },
      UPDATE_EMAILS: { emails: typings.custom<string[]>() },
      UPDATE_SOCIALS: { socials: typings.custom<any[]>() },
      UPDATE_WEBSITES: { websites: typings.custom<string[]>() },
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
      // Load existing intermediary data
      const stored = ls.get('intermediaries->') ?? {};
      const existingIntermediary = (stored as Record<string, any>)[id!];

      console.log(
        'Loaded existing intermediary from localStorage:',
        existingIntermediary,
      );

      if (existingIntermediary) {
        return {
          ...existingIntermediary,
          errors: {},
        };
      }
      return {
        ...DEFAULT_INTERMEDIARY,
        errors: {},
      };
    }),
    reset: assign('context', () => ({
      ...DEFAULT_INTERMEDIARY,
      errors: {},
    })),

    updateId: assign('context.id', {
      UPDATE_ID: ({ context }) => context.id || '',
    }),

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

    updatePhoneNumbers: assign('context.phoneNumbers', {
      UPDATE_PHONE_NUMBERS: ({ payload }) => payload.phoneNumbers,
    }),

    updateEmails: assign('context.emails', {
      UPDATE_EMAILS: ({ payload }) => payload.emails,
    }),

    updateSocials: assign('context.socials', {
      UPDATE_SOCIALS: ({ payload }) => payload.socials,
    }),

    updateWebsites: assign('context.websites', {
      UPDATE_WEBSITES: ({ payload }) => payload.websites,
    }),

    validate: assign('context.errors', ({ context }) => {
      const errors: Record<string, string> = {};

      if (!context.wallet?.trim()) {
        errors.wallet = 'Wallet is required';
      }

      if (context.personality === 'individual') {
        if (!context.firstName?.trim()) {
          errors.firstName = 'First name is required';
        }
        if (!context.lastName?.trim()) {
          errors.lastName = 'Last name is required';
        }
        if (!context.nationalID?.trim()) {
          errors.nationalID = 'National ID is required';
        }
      } else if (context.personality === 'company') {
        if (!context.companyName?.trim()) {
          errors.companyName = 'Company name is required';
        }
        if (!context.registrationNumber?.trim()) {
          errors.registrationNumber = 'Registration number is required';
        }
      }

      return errors;
    }),
  },

  delays: {
    MAX_DURATION: 10000,
  },
}));

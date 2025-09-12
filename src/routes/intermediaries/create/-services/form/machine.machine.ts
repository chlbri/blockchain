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
      UPDATE_SACRIFICE: { sacrifice: 'number' },
      UPDATE_PERSONALITY: { personality: typings.custom<Personality>() },
      UPDATE_FIRST_NAME: { firstName: 'string' },
      UPDATE_LAST_NAME: { lastName: 'string' },
      UPDATE_NATIONAL_ID: { nationalID: 'string' },
      UPDATE_COMPANY_NAME: { companyName: 'string' },
      UPDATE_REGISTRATION_NUMBER: { registrationNumber: 'string' },
      ADD_PHONE_NUMBER: {},
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
        index: 'number',
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
      sacrifice: 'number',
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
      }),
    }),
  }),
).provideOptions(({ assign }) => ({
  actions: {
    reset: assign('context', () => DEFAULT_INTERMEDIARY),

    updateId: assign('context.id', () => nanoid()),

    updateWallet: assign('context.wallet', {
      UPDATE_WALLET: ({ payload }) => payload.wallet,
    }),

    updateSacrifice: ({ context, event }: any) => ({
      ...context,
      sacrifice: event.payload.sacrifice,
    }),

    updatePersonality: ({ context, event }: any) => ({
      ...context,
      personality: event.payload.personality,
      // Clear fields from the other personality type
      ...(event.payload.personality === 'individual'
        ? {
            companyName: undefined,
            registrationNumber: undefined,
          }
        : {
            firstName: undefined,
            lastName: undefined,
            nationalID: undefined,
          }),
    }),

    updateFirstName: ({ context, event }: any) => ({
      ...context,
      firstName: event.payload.firstName,
    }),

    updateLastName: ({ context, event }: any) => ({
      ...context,
      lastName: event.payload.lastName,
    }),

    updateNationalId: ({ context, event }: any) => ({
      ...context,
      nationalID: event.payload.nationalID,
    }),

    updateCompanyName: ({ context, event }: any) => ({
      ...context,
      companyName: event.payload.companyName,
    }),

    updateRegistrationNumber: ({ context, event }: any) => ({
      ...context,
      registrationNumber: event.payload.registrationNumber,
    }),

    addPhoneNumber: ({ context }: any) => ({
      ...context,
      phoneNumbers: [
        ...(context.phoneNumbers || []),
        { countryCode: 33, number: 0 },
      ],
    }),

    updatePhoneNumber: ({ context, event }: any) => ({
      ...context,
      phoneNumbers: (context.phoneNumbers || []).map(
        (phone: any, index: number) =>
          index === event.payload.index
            ? { ...phone, ...event.payload.phoneNumber }
            : phone,
      ),
    }),

    removePhoneNumber: ({ context, event }: any) => ({
      ...context,
      phoneNumbers: (context.phoneNumbers || []).filter(
        (_: any, index: number) => index !== event.payload.index,
      ),
    }),

    addEmail: ({ context, event }: any) => ({
      ...context,
      emails: [...(context.emails || []), event.payload.email],
    }),

    updateEmail: ({ context, event }: any) => ({
      ...context,
      emails: (context.emails || []).map((email: string, index: number) =>
        index === event.payload.index ? event.payload.email : email,
      ),
    }),

    removeEmail: ({ context, event }: any) => ({
      ...context,
      emails: (context.emails || []).filter(
        (_: string, index: number) => index !== event.payload.index,
      ),
    }),

    addSocial: ({ context, event }: any) => ({
      ...context,
      socials: {
        ...(context.socials || {}),
        [event.payload.platform]: event.payload.url,
      },
    }),

    updateSocial: ({ context, event }: any) => ({
      ...context,
      socials: {
        ...(context.socials || {}),
        [event.payload.platform]: event.payload.url,
      },
    }),

    removeSocial: ({ context, event }: any) => {
      const socials = { ...(context.socials || {}) };
      delete socials[event.payload.platform];
      return {
        ...context,
        socials,
      };
    },

    addWebsite: ({ context, event }: any) => ({
      ...context,
      websites: [...(context.websites || []), event.payload.website],
    }),

    updateWebsite: ({ context, event }: any) => ({
      ...context,
      websites: (context.websites || []).map(
        (website: string, index: number) =>
          index === event.payload.index ? event.payload.website : website,
      ),
    }),

    removeWebsite: ({ context, event }: any) => ({
      ...context,
      websites: (context.websites || []).filter(
        (_: string, index: number) => index !== event.payload.index,
      ),
    }),

    validate: ({ context }: any) => {
      const errors: any = {};

      if (!context.wallet?.trim()) {
        errors.wallet = 'Le wallet est requis';
      }

      if (context.personality === 'individual') {
        if (!context.lastName?.trim()) {
          errors.lastName = 'Le nom de famille est requis';
        }
        if (!context.nationalID?.trim()) {
          errors.nationalID = "Le numéro d'identité nationale est requis";
        }
      } else if (context.personality === 'company') {
        if (!context.companyName?.trim()) {
          errors.companyName = "Le nom de l'entreprise est requis";
        }
        if (!context.registrationNumber?.trim()) {
          errors.registrationNumber =
            "Le numéro d'enregistrement est requis";
        }
      }

      if (
        !context.phoneNumbers?.length ||
        context.phoneNumbers[0].number === 0
      ) {
        errors.phoneNumbers = 'Au moins un numéro de téléphone est requis';
      }

      return {
        ...context,
        errors,
      };
    },
  },
}));

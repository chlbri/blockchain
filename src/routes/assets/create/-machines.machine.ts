import { createMachine, typings } from '@bemedev/app-ts';
import { SCHEMAS } from './-machines.machine.gen';

export const formMachine = createMachine(
  {
    initial: 'idle',
    __tsSchema: SCHEMAS.formMachine.__tsSchema,
    states: {
      idle: {},
      working: {
        on: {
          CHANGE_ID: { actions: 'updateId' },
        },
      },
    },
  },
  typings({
    context: {
      id: 'string',
      description: 'string',
      value: 'number',
      currency: 'string',
      medias: {
        photos: typings.custom<string[]>(),
        videos: typings.custom<string[]>(),
        documents: typings.custom<string[]>(),
      },
    },
    eventsMap: {
      CHANGE_ID: { id: 'string' },
    },
  }),
);

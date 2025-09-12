import sleep from '@bemedev/sleep';
import ls from 'localstorage-slim';
import { onCleanup } from 'solid-js';
import {
  addOptions,
  context,
  matches,
  select,
  send,
  stop,
} from './-services/form';
import { INTERMEDIARIES_STORAGE_KEY } from './-services/form/constants';

export const useHooks = () => {
  addOptions(() => ({
    promises: {
      submit: async ({
        context: { errors, id, ...intermediary },
      }: any) => {
        console.log('Intermediary creation started');
        if (!intermediary.wallet?.trim()) {
          throw new Error('Wallet is required');
        }

        await sleep(1000);
        console.log('Intermediary créé:', { ...intermediary, id });

        // Store intermediary in localStorage using localstorage-slim
        const all = ls.get(INTERMEDIARIES_STORAGE_KEY) ?? {};
        ls.set(INTERMEDIARIES_STORAGE_KEY, {
          ...all,
          [id!]: intermediary,
        });

        console.log(
          'Intermediary stored in localStorage inside:',
          INTERMEDIARIES_STORAGE_KEY,
        );
      },
    },
  }));

  const validateForm = () => {
    const errors = select('context.errors')();
    return !Object.keys(errors).length;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateForm()) return;
    send('SUBMIT');
  };

  onCleanup(stop);

  return {
    send,
    context,
    select,
    handleSubmit,
    submitting: matches('working/submitting'),
  };
};

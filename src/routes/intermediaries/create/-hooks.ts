import sleep from '@bemedev/sleep';
import { useNavigate } from '@tanstack/solid-router';
import ls from 'localstorage-slim';
import {
  addOptions,
  context,
  matches,
  select,
  send,
} from './-services/form';
import { INTERMEDIARIES_STORAGE_KEY } from './-services/form/constants';

export const useHooks = () => {
  const navigate = useNavigate();

  addOptions(({ voidAction }) => ({
    promises: {
      submit: async ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        context: { errors, id, ...intermediary },
      }) => {
        console.log('Intermediary creation started');
        if (!intermediary.wallet?.trim()) {
          throw new Error('Wallet is required');
        }

        await sleep(100);
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

        await sleep(100);
      },
    },
    actions: {
      end: voidAction(() => {
        navigate({ to: '/intermediaries', replace: true });
      }),
    },
  }));

  const validateForm = () => {
    const errors = select('context.errors')();
    return !Object.keys(errors || {}).length;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateForm()) return;
    send('SUBMIT');
  };

  return {
    send,
    context,
    select,
    handleSubmit,
    submitting: matches('working/submitting'),
  };
};

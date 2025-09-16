import sleep from '@bemedev/sleep';
import { useNavigate } from '@tanstack/solid-router';
import ls from 'localstorage-slim';
import { onCleanup, onMount } from 'solid-js';
import { service } from './-services/form';

export const useHooks = (id: string) => {
  const {
    addOptions,
    send,
    select,
    context,
    matches,
    start,
    stop,
    subscribe,
  } = service();

  addOptions(({ voidAction }) => ({
    promises: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      submit: async ({ context: { errors, ...intermediary } }) => {
        console.log('EXEC EDIT INTERMEDIARY');
        if (!intermediary.wallet?.trim()) {
          throw new Error('Wallet is required');
        }

        await sleep(100);

        console.log('Intermediary modifié:', intermediary);

        // #region Update intermediary in localStorage
        const all: any = ls.get('intermediaries->') ?? {};
        const current = (all[intermediary.id!] ??
          {}) as typeof intermediary;

        ls.set('intermediaries->', {
          ...all,
          [intermediary.id!]: { ...current, ...intermediary },
        });

        console.log(
          'Intermediary updated in localStorage inside:',
          'intermediaries->',
        );
        // #endregion

        await sleep(100);
      },
    },
    actions: {
      end: voidAction(() => {
        navigate({
          to: '/intermediaries',
          replace: true,
        });
      }),
    },
  }));

  const navigate = useNavigate();

  onMount(start);

  subscribe(({ status }) => {
    if (status === 'started') {
      send({ type: 'SET_ID', payload: { id } });
    }
  });

  const validateForm = () => {
    const errors = select('context.errors')();
    return Object.keys(errors || {}).length === 0;
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

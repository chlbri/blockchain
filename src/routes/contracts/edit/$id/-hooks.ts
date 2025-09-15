import sleep from '@bemedev/sleep';
import { useNavigate } from '@tanstack/solid-router';
import ls from 'localstorage-slim';
import { onCleanup, onMount } from 'solid-js';
import { service } from './-services/form';
import { CONTRACTS_STORAGE_KEY } from './-services/form/constants';

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

  addOptions(() => ({
    promises: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      submit: async ({ context: { errors, id, ...asset } }) => {
        console.log('EXEC EDIT');
        if (!asset.value || asset.value === '0') {
          throw new Error('Invalid value');
        }

        await sleep(100);

        console.log('Asset modifié:', { ...asset, id });

        // #region Update asset in localStorage using localstorage-slim
        const all: any = ls.get(CONTRACTS_STORAGE_KEY) ?? {};
        const current = (all[id!] ?? {}) as typeof asset;

        ls.set(CONTRACTS_STORAGE_KEY, {
          ...all,
          [id!]: { ...current, ...asset },
        });

        console.log(
          'Asset updated in localStorage inside:',
          CONTRACTS_STORAGE_KEY,
        );
        // #endregion

        await sleep(100);
      },
    },
  }));

  const navigate = useNavigate();

  onMount(start);

  subscribe(({ status }) => {
    if (status === 'started') {
      send({ type: 'SET_ID', payload: { id } });
    }
  });

  const validateAmount = () => {
    const error = select('context.errors.value')();
    return !error;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateAmount()) return;
    send('SUBMIT');

    return navigate({
      to: '/contracts',
      replace: true,
    });
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

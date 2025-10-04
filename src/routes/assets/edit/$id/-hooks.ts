import { CURRENCIES } from '#features/blockchain/back';
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

  addOptions(({ voidAction }) => ({
    promises: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      submit: async ({ context: { errors, id, ...asset } }) => {
        console.log('EXEC EDIT');
        if (!asset.value || asset.value === '0') {
          throw new Error('Invalid value');
        }

        // Convert currency string to Currency object
        const currencyObj = CURRENCIES.find(
          c => c.bank === asset.currency?.bank,
        );
        const assetWithCurrency = {
          ...asset,
          currency: currencyObj || CURRENCIES[0],
        };

        await sleep(100);

        console.log('Asset modifié:', { ...assetWithCurrency, id });

        // #region Update asset in localStorage using localstorage-slim
        const all: any = ls.get(CONTRACTS_STORAGE_KEY) ?? {};
        const current = (all[id!] ?? {}) as typeof assetWithCurrency;

        ls.set(CONTRACTS_STORAGE_KEY, {
          ...all,
          [id!]: { ...current, ...assetWithCurrency },
        });

        console.log(
          'Asset updated in localStorage inside:',
          CONTRACTS_STORAGE_KEY,
        );
        // #endregion

        await sleep(100);
      },
    },
    actions: {
      end: voidAction(() => {
        navigate({
          to: '/assets',
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

  const validateAmount = () => {
    const error = select('context.errors.value')();
    return !error;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateAmount()) return;
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

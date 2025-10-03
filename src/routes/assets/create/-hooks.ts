import { CURRENCIES } from '#features/blockchain/back';
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
import { CONTRACTS_STORAGE_KEY } from './-services/form/constants';

export const useHooks = () => {
  const navigate = useNavigate();
  addOptions(({ voidAction }) => ({
    promises: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      submit: async ({ context: { errors, id, ...asset } }) => {
        console.log('EXEC');
        if (!asset.value || asset.value === '0') {
          throw new Error('Invalid value');
        }

        // Convert currency string to Currency object
        const currencyObj = CURRENCIES.find(
          c => c.bank === asset.currency,
        );
        const assetWithCurrency = {
          ...asset,
          currency: currencyObj || CURRENCIES[0],
        };

        await sleep(100);

        console.log('Asset créé:', { ...assetWithCurrency, id });

        // #region Store asset in localStorage using localstorage-slim
        const all = ls.get(CONTRACTS_STORAGE_KEY) ?? {};

        ls.set(CONTRACTS_STORAGE_KEY, {
          ...all,
          [id!]: assetWithCurrency,
        });

        console.log(
          'New Asset stored in localStorage inside:',
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

  const validateAmount = () => {
    const error = select('context.errors.value')();
    return !error;
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateAmount()) return;
    send('SUBMIT');
  };

  // onCleanup(pause);

  return {
    send,
    context,
    select,
    handleSubmit,
    submitting: matches('working/submitting'),
  };
};

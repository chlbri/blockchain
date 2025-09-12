import { uniqueArray } from '#back/helpers';
import sleep from '@bemedev/sleep';
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
  addOptions(() => ({
    promises: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      submit: async ({ context: { errors, id, ...asset } }) => {
        console.log('EXEC');
        if (!asset.value || asset.value === '0') {
          throw new Error('Invalid value');
        }

        await sleep(100);

        console.log('Asset créé:', { ...asset, id });

        // #region Store asset in localStorage using localstorage-slim
        const all = ls.get(CONTRACTS_STORAGE_KEY) ?? {};

        ls.set(CONTRACTS_STORAGE_KEY, {
          ...all,
          [id!]: asset,
        });

        console.log(
          'New Asset stored in localStorage inside:',
          CONTRACTS_STORAGE_KEY,
        );
        // #endregion

        await sleep(100);
      },
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

export const displayNumberS = (num?: string, replacer = '.') => {
  if (!num) return '';
  const len = num.length;

  let result = '';
  for (let i = 0; i < len; i++) {
    result += num[i];
    const check = (len - i - 1) % 3 === 0 && i < len - 1;
    if (check) result += replacer;
  }

  return result;
};

export const retrieveNumberS = (str: string, ...replacers: string[]) => {
  const _replacers = uniqueArray(...replacers, '.');
  return _replacers.reduce((s, r) => s.replaceAll(r, ''), str);
};

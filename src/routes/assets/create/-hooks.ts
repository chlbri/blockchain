import sleep from '@bemedev/sleep';
import {
  addOptions,
  context,
  matches,
  select,
  send,
} from './-services/form';

export const useHooks = () => {
  addOptions(() => ({
    promises: {
      // #region Simulate API call
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      submit: async ({ context: { errors, ...context } }) => {
        await sleep(1000);
        console.log('Asset créé:', context);
      },
      // #endregion
    },
  }));

  const validateAmount = () => {
    const error = select('context.errors.value')();
    return !error;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validateAmount()) return;
    send('SUBMIT');
  };

  return {
    send,
    context,
    select,
    handleSubmit,
    submitting: () => matches('working.submitting')(),
  };
};

export const displayNumberS = (num?: string, replacer = '.') => {
  if (!num) return '';

  let result = '';
  for (let i = num.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      result = replacer + result;
    }
    result = num[i] + result;
  }

  return result;
};

export const uniqueArray = <T>(...arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

export const retrieveNumberS = (str: string, ...replacers: string[]) => {
  const _replacers = uniqueArray(...replacers, '.');
  return _replacers.reduce((s, r) => s.replaceAll(r, ''), str);
};

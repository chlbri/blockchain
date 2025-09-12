import { uniqueArray } from '#back/helpers';
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

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!validateAmount()) return;
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

export const displayNumberS = (num?: string, replacer = '.') => {
  if (!num) return '';

  let result = '';
  for (let i = 0, count = 0; i < num.length; i++, count++) {
    if (count > 0 && count % 3 === 0) {
      result = replacer + result;
    }
    result = num[i] + result;
  }

  return result;
};

export const retrieveNumberS = (str: string, ...replacers: string[]) => {
  const _replacers = uniqueArray(...replacers, '.');
  return _replacers.reduce((s, r) => s.replaceAll(r, ''), str);
};

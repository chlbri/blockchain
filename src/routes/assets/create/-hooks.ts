import type { Asset } from '#types';
import sleep from '@bemedev/sleep';
import {
  addOptions,
  context,
  matches,
  select,
  send,
} from './-services/form';
import { DEFAULT_ASSET } from './-services/form/constants';

export const useHooks = () => {
  addOptions(() => ({
    promises: {
      // Simulate API call
      submit: () => sleep(1000),
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
    const asset: Asset = { ...DEFAULT_ASSET, ...context() };
    console.log('Asset créé:', asset);
    alert('Asset créé avec succès !');
  };

  return {
    send,
    context,
    select,
    handleSubmit,
    submitting: () => matches('working.submitting')(),
  };
};

import { AmountInput } from '#components/organisms/AmountInput';
import { Component } from 'solid-js';
import { context, select, send } from '../-services/form';

export const WalletFields: Component = () => {
  const hasError = context(ctx => !!ctx.errors?.wallet);

  return (
    <div class='space-y-4'>
      <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
        Informations blockchain
      </h3>

      <div>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Adresse du portefeuille *
        </label>
        <input
          type='text'
          value={select('context.wallet')()}
          onInput={e => {
            const wallet = e.currentTarget.value;
            return send({
              type: 'UPDATE_WALLET',
              payload: { wallet },
            });
          }}
          placeholder='FR14 2004 1010 0505 0001 ...'
          class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white font-mono text-sm'
          classList={{
            'border-red-500 focus:ring-red-500': hasError(),
          }}
        />
        {hasError() && (
          <p class='mt-1 text-sm text-red-500'>
            {select('context.errors.wallet')()}
          </p>
        )}
        {!hasError() && (
          <p class='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            IBAN (International Bank Account Number) du compte bancaire de
            l'intermédiaire
          </p>
        )}
      </div>
      <AmountInput
        label='Montant de sacrifice (optionnel)'
        placeholder={() => '10_000'}
        onInput={sacrifice => {
          send({
            type: 'UPDATE_SACRIFICE',
            payload: { sacrifice },
          });
        }}
        value={select('context.sacrifice')}
        helperText="Montant que l'intermédiaire est prêt à sacrifier"
      />
    </div>
  );
};

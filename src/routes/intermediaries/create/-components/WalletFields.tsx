import { AmountInput } from '#components/organisms/AmountInput';
import { Input } from '#components/organisms/Input';
import { Component } from 'solid-js';
import { select, send } from '../-services/form';

export const WalletFields: Component = () => {
  return (
    <div class='space-y-4'>
      <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
        Informations blockchain
      </h3>

      <Input
        label='Adresse du portefeuille *'
        value={select('context.wallet')}
        onInput={wallet => {
          send({
            type: 'UPDATE_WALLET',
            payload: { wallet },
          });
        }}
        placeholder='FR14 2004 1010 0505 0001 ...'
        error={select('context.errors.wallet')}
        helperText='IBAN (International Bank Account Number) du compte bancaire de l’intermédiaire'
      />

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

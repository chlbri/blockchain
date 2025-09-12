import type { Component } from 'solid-js';
import { displayNumberS, retrieveNumberS } from '../-hooks';
import { context, select, send } from '../-services/form';

export const ValueInput: Component<{ class?: string }> = props => {
  const hasError = context(ctx => !!ctx.errors?.value);
  const error = select('context.errors.value');
  const value = context(ctx => displayNumberS(ctx.value));

  return (
    <div class={props.class}>
      <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
        Valeur *
      </label>
      <input
        type='text'
        value={value()}
        onInput={e => {
          const value = retrieveNumberS(e.currentTarget.value);
          send({
            type: 'UPDATE_VALUE',
            payload: { value },
          });
        }}
        placeholder='10_000'
        class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-10`}
        classList={{
          'border-red-500 focus:ring-red-500': hasError(),
        }}
      />
      {hasError() && <p class='mt-1 text-sm text-red-500'>{error()}</p>}
    </div>
  );
};

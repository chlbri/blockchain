import type { Component } from 'solid-js';
import {
  displayNumberS,
  retrieveNumberS,
} from '#globals/front/helpers/numbers';
import { Accessor } from 'solid-js';

interface Props {
  label: string;
  value: Accessor<string | undefined>;
  onInput: (value: string) => void;
  placeholder: Accessor<string>;
  required?: boolean;
  error?: Accessor<string>;
  class?: string;
  disabled?: Accessor<boolean>;
  helperText?: string;
  currency?: Accessor<string>;
}

export const AmountInput: Component<Props> = props => {
  const hasError = () => !!props.error;
  const isRequired = () => props.required ?? false;

  return (
    <div class={props.class}>
      <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
        {props.label}
        {isRequired() && ' *'}
      </label>
      <div class='relative'>
        <input
          type='text'
          value={displayNumberS(props.value())}
          onInput={e => {
            //Don't allow non numeric characters
            e.currentTarget.value = e.currentTarget.value.replace(
              /[^0-9.]/g,
              '',
            );
            const value = retrieveNumberS(e.currentTarget.value);
            props.onInput(value);
          }}
          placeholder={props.placeholder()}
          disabled={props.disabled?.()}
          class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-10 disabled:bg-gray-100 disabled:dark:bg-gray-600 disabled:cursor-not-allowed'
          classList={{
            'border-red-500 focus:ring-red-500': hasError(),
            'pr-12': !!props.currency,
          }}
        />
        {props.currency && (
          <div class='absolute inset-y-0 right-0 flex items-center pr-3'>
            <span class='text-gray-500 dark:text-gray-400 text-sm'>
              {props.currency?.()}
            </span>
          </div>
        )}
      </div>
      {hasError() && (
        <p class='mt-1 text-sm text-red-500'>{props.error?.()}</p>
      )}
      {props.helperText && !hasError() && (
        <p class='mt-1 text-xs text-gray-500 dark:text-gray-400'>
          {props.helperText}
        </p>
      )}
    </div>
  );
};

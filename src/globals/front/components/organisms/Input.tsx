import { Defined } from '#components/molecules/Defined';
import type { Component } from 'solid-js';
import { Accessor } from 'solid-js';

type Props = {
  label: string;
  value: Accessor<string | undefined | null>;
  onInput: (value: string) => void;
  placeholder: string;
  required?: boolean;
  error?: Accessor<string>;
  class?: string;
  disabled?: Accessor<boolean>;
  helperText?: string;
};

export const Input: Component<Props> = props => {
  const hasError = () => !!props.error?.();
  const isRequired = props.required === true;

  return (
    <div class={props.class}>
      <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
        {props.label}
        {isRequired && ' *'}
      </label>
      <div class='relative'>
        <input
          type='text'
          value={props.value() ?? ''}
          onInput={e => props.onInput(e.currentTarget.value)}
          placeholder={props.placeholder}
          disabled={props.disabled?.()}
          class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-10 disabled:bg-gray-100 disabled:dark:bg-gray-600 disabled:cursor-not-allowed'
          classList={{
            'border-red-500 focus:ring-red-500': hasError(),
          }}
        />
      </div>
      <Defined.WithAccessor data={props.error}>
        {error => <p class='mt-1 text-sm text-red-500'>{error}</p>}
      </Defined.WithAccessor>
      <Defined data={props.helperText} extraCheck={() => !hasError()}>
        {helperText => (
          <p class='mt-1 text-xs text-gray-500 dark:text-gray-400'>
            {helperText}
          </p>
        )}
      </Defined>
    </div>
  );
};

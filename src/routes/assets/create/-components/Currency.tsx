import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#cn/components/ui/select';
import type { Component } from 'solid-js';

export const Currency: Component<{
  currencies: string[];
  current: string;
  setCurrent: (value?: string | null) => void;
  error?: string;
}> = ({ currencies, current, setCurrent, error }) => (
  <div>
    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      Devise *
    </label>
    <Select
      onChange={setCurrent}
      value={current}
      defaultValue="USD"
      options={currencies}
      placeholder="Sélectionner une devise"
      itemComponent={props => {
        return (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        );
      }}
      class="h-10"
    >
      <SelectTrigger
        class="h-10"
        // classList={{
        //   'border-red-500 focus-visible:ring-red-500':
        //     !!errors().currency,
        // }}
      >
        <SelectValue<string>>
          {({ selectedOption }) => selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
    {error && <p class="text-red-600 text-sm mt-1">{error}</p>}
  </div>
);

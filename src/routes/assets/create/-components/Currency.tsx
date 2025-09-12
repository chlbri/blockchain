import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#cn/components/ui/select';
import type { Accessor, Component } from 'solid-js';

export const Currency: Component<{
  currencies: string[];
  current: Accessor<string>;
  setCurrent: (value?: string | null) => void;
}> = ({ currencies, current, setCurrent }) => (
  <div>
    <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
      Devise *
    </label>
    <Select
      onChange={setCurrent}
      value={current()}
      defaultValue='USD'
      options={currencies}
      placeholder='Sélectionner une devise'
      itemComponent={props => {
        return (
          <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
        );
      }}
      class='h-10'
    >
      <SelectTrigger class='h-10'>
        <SelectValue<string>>
          {({ selectedOption }) => selectedOption()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  </div>
);

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#cn/components/ui/select';
import { CURRENCIES } from '#features/blockchain/back';
import { createMemo, type Accessor, type Component } from 'solid-js';

type CurrencyType = {
  display: string;
  bank: string;
};

export const Currency: Component<{
  currencies: CurrencyType[];
  current: Accessor<string>;
  setCurrent: (value?: string | null) => void;
}> = ({ currencies, current, setCurrent }) => {
  const defaultV = createMemo(() => current() ?? CURRENCIES[0].bank);

  return (
    <div>
      <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
        Devise *
      </label>
      <Select
        onChange={setCurrent}
        value={current()}
        defaultValue={defaultV()}
        options={currencies.map(c => c.bank)}
        placeholder='Sélectionner une devise'
        itemComponent={props => {
          const currency = currencies.find(
            c => c.bank === props.item.rawValue,
          )!;
          return (
            <SelectItem item={props.item}>
              {`${currency.display} (${currency.bank})`}
            </SelectItem>
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
};

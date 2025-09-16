import { Defined } from '#components/molecules/Defined';
import {
  Component,
  createSignal,
  For,
  Show,
  type Accessor,
} from 'solid-js';
type MediaSectionProps = {
  title: string;
  items?: Accessor<string[]>;
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string) => void;
  placeholder: string;
};

export const Medias: Component<MediaSectionProps> = ({
  title,
  items,
  onAdd,
  onRemove,
  onUpdate,
  placeholder,
}) => {
  const [newItem, setNewItem] = createSignal('');
  const reset = () => setNewItem('');

  const handleAdd = () => {
    const value = newItem();
    if (value !== '') {
      onAdd(value);
      reset();
    }
  };

  return (
    <div class='border border-gray-200 dark:border-gray-600 rounded-lg p-4'>
      <h4 class='font-medium text-gray-900 dark:text-white mb-3'>
        {title}
      </h4>
      <div class='flex gap-2 mb-3'>
        <input
          type='url'
          value={newItem()}
          onChange={e => setNewItem(e.currentTarget.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setNewItem(e.currentTarget.value);
              handleAdd();
            }
          }}
          placeholder={placeholder}
          class='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
        />
        <button
          type='button'
          onClick={handleAdd}
          class='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200'
        >
          Ajouter
        </button>
      </div>
      <Defined.WithA
        data={items}
        extraCheck={({ length }) => length > 0}
        fallback={
          <p class='text-sm text-gray-500 dark:text-gray-400 italic'>
            {/* TODO: To perform */}
            Pas de {title.toLowerCase()}
          </p>
        }
      >
        {items => (
          <div class='space-y-2'>
            <For each={items}>
              {(item, index) => {
                const [mode, setMode] = createSignal<'edit' | 'view'>(
                  'view',
                );

                const toggle = () => {
                  setMode(value => (value === 'view' ? 'edit' : 'view'));
                };

                const [newItem, setNewItem] = createSignal(item);

                const handleUpdate = () => {
                  const value = newItem().trim();
                  if (value !== '' && value !== item) {
                    onUpdate(index(), value);
                  }
                  toggle();
                };
                return (
                  <div class='flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded'>
                    <Show
                      when={mode() === 'edit'}
                      fallback={
                        <span class='flex-1 text-sm text-gray-700 dark:text-gray-300 truncate'>
                          {item}
                        </span>
                      }
                    >
                      <input
                        type='url'
                        value={newItem()}
                        onChange={e => {
                          const value = e.currentTarget.value;
                          setNewItem(value);
                          return onUpdate(index(), newItem());
                        }}
                        onKeyPress={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            setNewItem(e.currentTarget.value);
                            handleUpdate();
                          }
                        }}
                        class='flex-1 mr-6 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm'
                      />
                    </Show>
                    <div class='flex space-x-1 text-2xl'>
                      <button type='button' onClick={handleUpdate}>
                        <Show when={mode() === 'edit'} fallback='✏️'>
                          <svg
                            viewBox='0 0 24 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                            class='size-7 stroke-green-700'
                          >
                            <path
                              d='M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984'
                              stroke-width='2'
                            />
                            <path
                              d='M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z'
                              stroke-width='2'
                            />
                          </svg>
                        </Show>
                      </button>
                      <button
                        type='button'
                        disabled={mode() === 'edit'}
                        onClick={() => onRemove(index())}
                        class='text-red-500 hover:text-red-700 p-1 group'
                      >
                        <svg
                          class='size-5 group-disabled:text-gray-500/30'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          aria-disabled={mode() === 'edit'}
                        >
                          <path
                            stroke-linecap='round'
                            stroke-linejoin='round'
                            stroke-width='2'
                            d='M6 18L18 6M6 6l12 12'
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        )}
      </Defined.WithA>
    </div>
  );
};

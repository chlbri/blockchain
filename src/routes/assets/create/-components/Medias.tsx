import { Component, createSignal } from 'solid-js';
type MediaSectionProps = {
  title: string;
  items?: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
};

export const Medias: Component<MediaSectionProps> = ({
  title,
  items = [],
  onAdd,
  onRemove,
  placeholder,
}) => {
  const [newItem, setNewItem] = createSignal('');

  const handleAdd = () => {
    const value = newItem().trim();
    if (value) {
      onAdd(value);
      setNewItem('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div class="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
      <h4 class="font-medium text-gray-900 dark:text-white mb-3">
        {title}
      </h4>

      <div class="flex gap-2 mb-3">
        <input
          type="url"
          value={newItem()}
          onInput={e => setNewItem(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          type="button"
          onClick={handleAdd}
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
        >
          Ajouter
        </button>
      </div>

      {items?.length > 0 && (
        <div class="space-y-2">
          {items.map((item, index) => (
            <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                {item}
              </span>
              <button
                type="button"
                onClick={() => onRemove(index)}
                class="text-red-500 hover:text-red-700 p-1"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <p class="text-sm text-gray-500 dark:text-gray-400 italic">
          Aucun {title.toLowerCase()} ajouté
        </p>
      )}
    </div>
  );
};

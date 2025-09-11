import type { Asset } from '#types';
import { createFileRoute } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export const Route = createFileRoute('/assets/create')({
  component: CreateAsset,
});

type AssetFormData = {
  id: string;
  description: string;
  value: number;
  currency: string;
  media: {
    photos: string[];
    videos: string[];
    documents: string[];
  };
};

const currencies = [
  'EUR',
  'USD',
  'GBP',
  'JPY',
  'CAD',
  'AUD',
  'CHF',
  'CNY',
  'BTC',
  'ETH',
];

function CreateAsset() {
  const [formData, setFormData] = createStore<AssetFormData>({
    id: '',
    description: '',
    value: 0,
    currency: 'EUR',
    media: {
      photos: [],
      videos: [],
      documents: [],
    },
  });

  const [errors, setErrors] = createSignal<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) {
      newErrors.id = "L'ID est requis";
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (formData.value <= 0) {
      newErrors.value = 'La valeur doit être positive';
    }

    if (!formData.currency) {
      newErrors.currency = 'La devise est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const asset: Asset = {
        ...formData,
      };

      console.log('Asset créé:', asset);

      // Reset form
      setFormData({
        id: '',
        description: '',
        value: 0,
        currency: 'EUR',
        media: {
          photos: [],
          videos: [],
          documents: [],
        },
      });

      alert('Asset créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      alert("Erreur lors de la création de l'asset");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addMediaItem = (
    type: 'photos' | 'videos' | 'documents',
    value: string,
  ) => {
    if (value.trim()) {
      setFormData('media', type, (prev: string[]) => [
        ...prev,
        value.trim(),
      ]);
    }
  };

  const removeMediaItem = (
    type: 'photos' | 'videos' | 'documents',
    index: number,
  ) => {
    setFormData('media', type, (prev: string[]) =>
      prev.filter((_: string, i: number) => i !== index),
    );
  };

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div class="container mx-auto px-4 max-w-2xl">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Créer un nouvel Asset
            </h1>
            <p class="text-gray-600 dark:text-gray-300">
              Remplissez les informations pour créer un nouvel asset sur la
              blockchain
            </p>
          </div>

          <form onSubmit={handleSubmit} class="space-y-6">
            {/* ID Field */}
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ID de l'asset *
              </label>
              <input
                type="text"
                value={formData.id}
                onInput={e => setFormData('id', e.currentTarget.value)}
                placeholder="asset-001"
                class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  errors().id
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors().id && (
                <p class="mt-1 text-sm text-red-500">{errors().id}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onInput={e =>
                  setFormData('description', e.currentTarget.value)
                }
                placeholder="Description détaillée de l'asset..."
                rows={4}
                class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical ${
                  errors().description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors().description && (
                <p class="mt-1 text-sm text-red-500">
                  {errors().description}
                </p>
              )}
            </div>

            {/* Value and Currency Fields */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onInput={e =>
                    setFormData(
                      'value',
                      parseFloat(e.currentTarget.value) || 0,
                    )
                  }
                  placeholder="10000"
                  class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors().value
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                />
                {errors().value && (
                  <p class="mt-1 text-sm text-red-500">{errors().value}</p>
                )}
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Devise *
                </label>
                <select
                  value={formData.currency}
                  onChange={e =>
                    setFormData('currency', e.currentTarget.value)
                  }
                  class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                    errors().currency
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                >
                  {currencies.map(currency => (
                    <option value={currency}>{currency}</option>
                  ))}
                </select>
                {errors().currency && (
                  <p class="mt-1 text-sm text-red-500">
                    {errors().currency}
                  </p>
                )}
              </div>
            </div>

            {/* Media Section */}
            <div class="space-y-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Médias
              </h3>

              {/* Photos */}
              <MediaSection
                title="Photos"
                items={formData.media.photos}
                onAdd={value => addMediaItem('photos', value)}
                onRemove={index => removeMediaItem('photos', index)}
                placeholder="URL de la photo"
              />

              {/* Videos */}
              <MediaSection
                title="Vidéos"
                items={formData.media.videos}
                onAdd={value => addMediaItem('videos', value)}
                onRemove={index => removeMediaItem('videos', index)}
                placeholder="URL de la vidéo"
              />

              {/* Documents */}
              <MediaSection
                title="Documents"
                items={formData.media.documents}
                onAdd={value => addMediaItem('documents', value)}
                onRemove={index => removeMediaItem('documents', index)}
                placeholder="URL du document"
              />
            </div>

            {/* Submit Button */}
            <div class="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting()}
                class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {isSubmitting() ? 'Création...' : "Créer l'Asset"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({
                    id: '',
                    description: '',
                    value: 0,
                    currency: 'EUR',
                    media: { photos: [], videos: [], documents: [] },
                  });
                  setErrors({});
                }}
                class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

type MediaSectionProps = {
  title: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
  placeholder: string;
};

function MediaSection(props: MediaSectionProps) {
  const [newItem, setNewItem] = createSignal('');

  const handleAdd = () => {
    const value = newItem().trim();
    if (value) {
      props.onAdd(value);
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
        {props.title}
      </h4>

      <div class="flex gap-2 mb-3">
        <input
          type="url"
          value={newItem()}
          onInput={e => setNewItem(e.currentTarget.value)}
          onKeyPress={handleKeyPress}
          placeholder={props.placeholder}
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

      {props.items.length > 0 && (
        <div class="space-y-2">
          {props.items.map((item, index) => (
            <div class="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded">
              <span class="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                {item}
              </span>
              <button
                type="button"
                onClick={() => props.onRemove(index)}
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

      {props.items.length === 0 && (
        <p class="text-sm text-gray-500 dark:text-gray-400 italic">
          Aucun {props.title.toLowerCase()} ajouté
        </p>
      )}
    </div>
  );
}

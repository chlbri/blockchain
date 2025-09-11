import type { Asset } from '#types';
import { createFileRoute } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Currency } from './-components/Currency';
import { Medias } from './-components/Medias';

export const Route = createFileRoute('/assets/create')({
  component: CreateAsset,
});

const currencies = [
  'EUR',
  'USD',
  'XOF',
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
  const [formData, setFormData] = createStore<Asset>({
    id: '',
    description: '',
    value: 0,
    currency: 'EUR',
    medias: {
      photos: [],
      videos: [],
      documents: [],
    },
  });

  const [errors, setErrors] = createStore<Record<string, string>>({});
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
        medias: {
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
      setFormData('medias', type, (prev = []) => [...prev, value.trim()]);
    }
  };

  const removeMediaItem = (
    type: 'photos' | 'videos' | 'documents',
    index: number,
  ) => {
    setFormData('medias', type, (prev = []) =>
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
                  errors.id
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.id && (
                <p class="mt-1 text-sm text-red-500">{errors.id}</p>
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
                  errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
              />
              {errors.description && (
                <p class="mt-1 text-sm text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Value and Currency Fields */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="h-full">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valeur *
                </label>
                <input
                  type="number"
                  min={1000}
                  step={10}
                  value={formData.value}
                  onInput={e =>
                    setFormData(
                      'value',
                      parseFloat(e.currentTarget.value) || 0,
                    )
                  }
                  placeholder="10000"
                  class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-10`}
                  classList={{
                    'border-red-500 focus:ring-red-500': !!errors.value,
                  }}
                />
                {errors.value && (
                  <p class="mt-1 text-sm text-red-500">{errors.value}</p>
                )}
              </div>

              <Currency
                currencies={currencies}
                current={formData.currency}
                setCurrent={value =>
                  value && setFormData('currency', value)
                }
                error={errors.currency}
              />
            </div>

            {/* Media Section */}
            <div class="space-y-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                Médias
              </h3>

              {/* Photos */}
              <Medias
                title="Photos"
                items={formData.medias.photos}
                onAdd={value => addMediaItem('photos', value)}
                onRemove={index => removeMediaItem('photos', index)}
                placeholder="URL de la photo"
              />

              {/* Videos */}
              <Medias
                title="Vidéos"
                items={formData.medias.videos}
                onAdd={value => addMediaItem('videos', value)}
                onRemove={index => removeMediaItem('videos', index)}
                placeholder="URL de la vidéo"
              />

              {/* Documents */}
              <Medias
                title="Documents"
                items={formData.medias.documents}
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
                    medias: { photos: [], videos: [], documents: [] },
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

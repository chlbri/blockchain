import type { Asset } from '#types';
import { createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';

export const hook = () => {
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

  const [errors, setErrors] = createSignal<string>();
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const validateAmount = () => {
    let error: string | undefined;

    if (formData.value <= 0) {
      error = 'La valeur doit être positive';
    }

    setErrors(error);
    return !error;
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validateAmount()) return;
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

  type Media = keyof Asset['medias'];

  const addMediaItem = (type: Media, value: string) => {
    if (value.trim() !== '') {
      setFormData('medias', type, (prev = []) => [...prev, value.trim()]);
    }
  };

  const updateMediaItem = (type: Media, index: number, value: string) => {
    setFormData('medias', type, (prev = []) =>
      prev.map((item: string, i: number) => (i === index ? value : item)),
    );
  };

  const removeMediaItem = (type: Media, index: number) => {
    setFormData('medias', type, (prev = []) =>
      prev.filter((_: string, i: number) => i !== index),
    );
  };

  const media = {
    add: addMediaItem,
    update: updateMediaItem,
    remove: removeMediaItem,
  };

  return {
    formData,
    setFormData,
    errors,
    isSubmitting,
    handleSubmit,
    validateAmount,
    media,
  };
};

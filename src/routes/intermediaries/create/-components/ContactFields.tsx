import { Defined } from '#components/molecules/Defined';
import { For, Show } from 'solid-js';

interface ContactFieldsProps {
  phoneNumbers: { countryCode: number; number: number }[];
  emails: string[];
  socials: Record<string, string>;
  websites: string[];
  onAddPhone: (countryCode: number, number: number) => void;
  onUpdatePhone: (
    index: number,
    phone: { countryCode?: number; number?: number },
  ) => void;
  onRemovePhone: (index: number) => void;
  onAddEmail: (email: string) => void;
  onUpdateEmail: (index: number, email: string) => void;
  onRemoveEmail: (index: number) => void;
  onAddSocial: (platform: string, url: string) => void;
  onUpdateSocial: (platform: string, url: string) => void;
  onRemoveSocial: (platform: string) => void;
  onAddWebsite: (website: string) => void;
  onUpdateWebsite: (index: number, website: string) => void;
  onRemoveWebsite: (index: number) => void;
  errors: {
    phoneNumbers?: string;
    emails?: string;
  };
}

export const ContactFields = (props: ContactFieldsProps) => {
  let newPhoneCountryRef: HTMLInputElement | undefined;
  let newPhoneNumberRef: HTMLInputElement | undefined;
  let newEmailRef: HTMLInputElement | undefined;
  let newSocialPlatformRef: HTMLInputElement | undefined;
  let newSocialUrlRef: HTMLInputElement | undefined;
  let newWebsiteRef: HTMLInputElement | undefined;

  const handleAddPhone = () => {
    const countryCode = parseInt(newPhoneCountryRef?.value.trim() || '0');
    const number = parseInt(newPhoneNumberRef?.value.trim() || '0');
    if (countryCode && number) {
      props.onAddPhone(countryCode, number);
      newPhoneCountryRef!.value = '';
      newPhoneNumberRef!.value = '';
    }
  };

  const handleAddEmail = () => {
    const email = newEmailRef?.value.trim();
    if (email) {
      props.onAddEmail(email);
      newEmailRef!.value = '';
    }
  };

  const handleAddSocial = () => {
    const platform = newSocialPlatformRef?.value.trim();
    const url = newSocialUrlRef?.value.trim();
    if (platform && url) {
      props.onAddSocial(platform, url);
      newSocialPlatformRef!.value = '';
      newSocialUrlRef!.value = '';
    }
  };

  const handleAddWebsite = () => {
    const website = newWebsiteRef?.value.trim();
    if (website) {
      props.onAddWebsite(website);
      newWebsiteRef!.value = '';
    }
  };

  return (
    <div class='space-y-6'>
      <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
        Informations de contact
      </h3>

      {/* Phone Numbers */}
      <div class='space-y-3'>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Numéros de téléphone *
        </label>
        <For each={props.phoneNumbers}>
          {(phone, index) => (
            <div class='flex gap-2 items-center'>
              <span class='w-20 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-600 text-sm text-gray-700 dark:text-gray-300'>
                +{phone.countryCode}
              </span>
              <span class='flex-1 px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-600 text-sm text-gray-700 dark:text-gray-300'>
                {phone.number}
              </span>

              <Show when={props.phoneNumbers.length > 1}>
                <button
                  type='button'
                  onClick={() => props.onRemovePhone(index())}
                  class='p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
                >
                  ✕
                </button>
              </Show>
            </div>
          )}
        </For>
        <div class='flex gap-2'>
          <input
            ref={newPhoneCountryRef}
            type='number'
            placeholder='+225'
            class='w-20 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
          <input
            ref={newPhoneNumberRef}
            type='number'
            placeholder='123456789'
            class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            onKeyPress={e => e.key === 'Enter' && handleAddPhone()}
          />
          <button
            type='button'
            onClick={handleAddPhone}
            class='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
          >
            Ajouter
          </button>
        </div>

        <Defined data={props.errors.phoneNumbers}>
          {error => <p class='text-sm text-red-500'>{error}</p>}
        </Defined>
      </div>

      {/* Emails */}
      <div class='space-y-3'>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Adresses e-mail
        </label>
        <For each={props.emails}>
          {(email, index) => (
            <div class='flex gap-2 items-center'>
              <input
                type='email'
                value={email}
                onInput={e =>
                  props.onUpdateEmail(index(), e.currentTarget.value)
                }
                placeholder='exemple@email.com'
                class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
              <button
                type='button'
                onClick={() => props.onRemoveEmail(index())}
                class='p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
              >
                ✕
              </button>
            </div>
          )}
        </For>
        <div class='flex gap-2'>
          <input
            ref={newEmailRef}
            type='email'
            placeholder='Nouvelle adresse e-mail'
            class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            onKeyPress={e => e.key === 'Enter' && handleAddEmail()}
          />
          <button
            type='button'
            onClick={handleAddEmail}
            class='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
          >
            Ajouter
          </button>
        </div>

        <Defined data={props.errors.emails}>
          {error => <p class='text-sm text-red-500'>{error}</p>}
        </Defined>
      </div>

      {/* Social Media */}
      <div class='space-y-3'>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Réseaux sociaux
        </label>
        <For each={Object.entries(props.socials || {})}>
          {([platform, url]) => (
            <div class='flex gap-2 items-center'>
              <input
                type='text'
                value={platform}
                onInput={e =>
                  props.onUpdateSocial(e.currentTarget.value, url)
                }
                placeholder='Plateforme'
                class='w-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
              <input
                type='url'
                value={url}
                onInput={e =>
                  props.onUpdateSocial(platform, e.currentTarget.value)
                }
                placeholder='https://...'
                class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
              <button
                type='button'
                onClick={() => props.onRemoveSocial(platform)}
                class='p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
              >
                ✕
              </button>
            </div>
          )}
        </For>
        <div class='flex gap-2'>
          <input
            ref={newSocialPlatformRef}
            type='text'
            placeholder='Plateforme'
            class='w-32 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
          <input
            ref={newSocialUrlRef}
            type='url'
            placeholder='https://...'
            class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            onKeyPress={e => e.key === 'Enter' && handleAddSocial()}
          />
          <button
            type='button'
            onClick={handleAddSocial}
            class='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
          >
            Ajouter
          </button>
        </div>
      </div>

      {/* Websites */}
      <div class='space-y-3'>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Sites web
        </label>
        <For each={props.websites}>
          {(website, index) => (
            <div class='flex gap-2 items-center'>
              <input
                type='url'
                value={website}
                onInput={e =>
                  props.onUpdateWebsite(index(), e.currentTarget.value)
                }
                placeholder='https://...'
                class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
              />
              <button
                type='button'
                onClick={() => props.onRemoveWebsite(index())}
                class='p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300'
              >
                ✕
              </button>
            </div>
          )}
        </For>
        <div class='flex gap-2'>
          <input
            ref={newWebsiteRef}
            type='url'
            placeholder='https://nouveau-site.com'
            class='flex-1 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            onKeyPress={e => e.key === 'Enter' && handleAddWebsite()}
          />
          <button
            type='button'
            onClick={handleAddWebsite}
            class='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

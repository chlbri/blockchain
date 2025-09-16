import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#cn-comp/sheet';
import type { Intermediary } from '#features/blockchain/back';
import { For, Show } from 'solid-js';

type ViewSheetProps = {
  intermediary?: Intermediary | null;
  isOpen: boolean;
  onClose: () => void;
};

export const ViewSheet = (props: ViewSheetProps) => {
  const getIntermediaryName = (intermediary: Intermediary) => {
    if (intermediary.personality === 'individual') {
      return `${intermediary.name?.firstName ?? ''} ${intermediary.name?.lastName ?? ''}`.trim();
    }
    return intermediary.companyName ?? '';
  };

  const getContactCount = (intermediary: Intermediary) => {
    const phoneCount = intermediary.contacts.phoneNumbers?.length || 0;
    const emailCount = intermediary.contacts.emails?.length || 0;
    const socialCount = intermediary.contacts.socials?.length || 0;
    const websiteCount = intermediary.contacts.websites?.length || 0;
    return phoneCount + emailCount + socialCount + websiteCount;
  };

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onClose}>
      <SheetContent class='w-full sm:max-w-lg scroll-auto overflow-scroll no-scrollbar h-screen'>
        <SheetHeader>
          <SheetTitle>Détails de l'Intermédiaire</SheetTitle>
          <SheetDescription>
            Informations complètes sur l'intermédiaire sélectionné
          </SheetDescription>
        </SheetHeader>

        <Show when={props.intermediary}>
          {intermediary => (
            <div class='mt-6 space-y-6'>
              {/* Basic Information */}
              <div class='space-y-4'>
                <div>
                  <h3 class='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Informations générales
                  </h3>
                  <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3'>
                    <div>
                      <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        Nom
                      </label>
                      <p class='text-gray-900 dark:text-white mt-1'>
                        {getIntermediaryName(intermediary())}
                      </p>
                    </div>
                    <div>
                      <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        ID de l'Intermédiaire
                      </label>
                      <p class='font-mono text-sm text-gray-900 dark:text-white mt-1'>
                        {intermediary().id}
                      </p>
                    </div>
                    <div>
                      <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        Type
                      </label>
                      <p class='text-gray-900 dark:text-white mt-1 capitalize'>
                        {intermediary().personality === 'individual'
                          ? 'Individuel'
                          : 'Entreprise'}
                      </p>
                    </div>
                    <div>
                      <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        Wallet
                      </label>
                      <p class='font-mono text-sm text-gray-900 dark:text-white mt-1'>
                        {intermediary().wallet}
                      </p>
                    </div>
                    {intermediary().sacrifice && (
                      <div>
                        <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                          Sacrifice
                        </label>
                        <p class='text-gray-900 dark:text-white mt-1'>
                          {intermediary().sacrifice}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Personal/Company Information */}
                <div>
                  <h3 class='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    {intermediary().personality === 'individual'
                      ? 'Informations personnelles'
                      : 'Informations entreprise'}
                  </h3>
                  <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3'>
                    <Show
                      when={intermediary().personality === 'individual'}
                      fallback={
                        <>
                          <div>
                            <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                              Nom de l'entreprise
                            </label>
                            <p class='text-gray-900 dark:text-white mt-1'>
                              {(intermediary() as any).companyName ??
                                'N/A'}
                            </p>
                          </div>
                          <div>
                            <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                              Numéro d'enregistrement
                            </label>
                            <p class='text-gray-900 dark:text-white mt-1'>
                              {(intermediary() as any)
                                .registrationNumber ?? 'N/A'}
                            </p>
                          </div>
                        </>
                      }
                    >
                      <div class='grid grid-cols-2 gap-4'>
                        <div>
                          <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                            Prénom
                          </label>
                          <p class='text-gray-900 dark:text-white mt-1'>
                            {(intermediary() as any).name?.firstName ??
                              'N/A'}
                          </p>
                        </div>
                        <div>
                          <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                            Nom
                          </label>
                          <p class='text-gray-900 dark:text-white mt-1'>
                            {(intermediary() as any).name?.lastName ??
                              'N/A'}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                          ID National
                        </label>
                        <p class='text-gray-900 dark:text-white mt-1'>
                          {(intermediary() as any).nationalID ?? 'N/A'}
                        </p>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 class='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Contacts ({getContactCount(intermediary())})
                  </h3>
                  <div class='space-y-4'>
                    {/* Phone Numbers */}
                    <Show
                      when={intermediary().contacts.phoneNumbers?.length}
                    >
                      <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                        <h4 class='font-medium text-gray-900 dark:text-white mb-2'>
                          Numéros de téléphone
                        </h4>
                        <div class='space-y-2'>
                          <For each={intermediary().contacts.phoneNumbers}>
                            {phone => (
                              <div class='text-sm text-gray-600 dark:text-gray-400'>
                                +{phone.countryCode} {phone.number}
                                {phone.network && ` (${phone.network})`}
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>

                    {/* Emails */}
                    <Show when={intermediary().contacts.emails?.length}>
                      <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                        <h4 class='font-medium text-gray-900 dark:text-white mb-2'>
                          Emails
                        </h4>
                        <div class='space-y-2'>
                          <For each={intermediary().contacts.emails}>
                            {email => (
                              <div class='text-sm text-gray-600 dark:text-gray-400'>
                                {email}
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>

                    {/* Social Media */}
                    <Show when={intermediary().contacts.socials?.length}>
                      <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                        <h4 class='font-medium text-gray-900 dark:text-white mb-2'>
                          Réseaux sociaux
                        </h4>
                        <div class='space-y-2'>
                          <For each={intermediary().contacts.socials}>
                            {social => (
                              <div class='text-sm text-gray-600 dark:text-gray-400'>
                                <span class='font-medium'>
                                  {social.platform}:
                                </span>{' '}
                                {social.url}
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>

                    {/* Websites */}
                    <Show when={intermediary().contacts.websites?.length}>
                      <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                        <h4 class='font-medium text-gray-900 dark:text-white mb-2'>
                          Sites web
                        </h4>
                        <div class='space-y-2'>
                          <For each={intermediary().contacts.websites}>
                            {website => (
                              <div class='text-sm text-gray-600 dark:text-gray-400'>
                                {website}
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Show>
      </SheetContent>
    </Sheet>
  );
};

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '#cn-comp/sheet';
import { displayNumberS } from '#globals/front/helpers/numbers';
import type { Asset } from '#types';
import { Show } from 'solid-js';
import { AccordionSheet } from './ViewSheet.accordion';

type ViewSheetProps = {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
};

export const ViewSheet = (props: ViewSheetProps) => {
  const getTotalMediaCount = (asset: Asset) => {
    return (
      (asset.medias?.photos?.length || 0) +
      (asset.medias?.videos?.length || 0) +
      (asset.medias?.documents?.length || 0)
    );
  };

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onClose}>
      <SheetContent class='w-full sm:max-w-lg scroll-auto overflow-scroll no-scrollbar h-screen'>
        <SheetHeader>
          <SheetTitle>Détails de l'Asset</SheetTitle>
          <SheetDescription>
            Informations complètes sur l'asset sélectionné
          </SheetDescription>
        </SheetHeader>

        <Show when={props.asset}>
          {asset => (
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
                        Description
                      </label>
                      <p class='text-gray-900 dark:text-white mt-1'>
                        {asset().description}
                      </p>
                    </div>
                    <div>
                      <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                        ID de l'Asset
                      </label>
                      <p class='font-mono text-sm text-gray-900 dark:text-white mt-1'>
                        {asset().id}
                      </p>
                    </div>
                    <div class='grid grid-cols-2 gap-4'>
                      <div>
                        <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                          Valeur
                        </label>
                        <p class='text-2xl font-bold text-gray-900 dark:text-white mt-1'>
                          {displayNumberS(asset().value.toString())}
                        </p>
                      </div>
                      <div>
                        <label class='text-sm font-medium text-gray-600 dark:text-gray-400'>
                          Devise
                        </label>
                        <p class='text-lg text-gray-900 dark:text-white mt-1 uppercase'>
                          {asset().currency.display} (
                          {asset().currency.bank})
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Information */}
                <div>
                  <h3 class='text-lg font-semibold text-gray-900 dark:text-white mb-2'>
                    Médias ({getTotalMediaCount(asset())})
                  </h3>
                  <div class='space-y-4'>
                    <AccordionSheet
                      data={[
                        {
                          title: 'Photos',
                          items: asset().medias?.photos,
                        },
                        {
                          title: 'Vidéos',
                          items: asset().medias?.videos,
                        },
                        {
                          title: 'Documents',
                          items: asset().medias?.documents,
                        },
                      ]}
                    />
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

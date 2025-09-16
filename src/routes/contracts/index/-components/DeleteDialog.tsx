import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#cn-comp/dialog';
import type { Asset } from '#types';
import { createSignal, Show } from 'solid-js';

type DeleteDialogProps = {
  asset?: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (asset: Asset) => void;
};

export const DeleteDialog = (props: DeleteDialogProps) => {
  const [isDeleting, setIsDeleting] = createSignal(false);

  const handleConfirm = () => {
    if (!props.asset) return;

    setIsDeleting(true);
    try {
      props.onConfirm(props.asset);
      props.onClose();
    } catch (error) {
      console.error('Error deleting asset:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer l'Asset</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cet asset ? Cette action est
            irréversible.
          </DialogDescription>
        </DialogHeader>

        <Show when={props.asset}>
          {asset => (
            <div class='py-4'>
              <div class='bg-gray-50 dark:bg-gray-800 p-4 rounded-lg'>
                <h4 class='font-medium text-gray-900 dark:text-white mb-2'>
                  {asset().description}
                </h4>
                <p class='text-sm text-gray-600 dark:text-gray-400 mb-2'>
                  ID:{' '}
                  <code class='bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs'>
                    {asset().id}
                  </code>
                </p>
                <p class='text-sm text-gray-600 dark:text-gray-400'>
                  Valeur: {asset().value.toLocaleString()}{' '}
                  {asset().currency.display}
                </p>
              </div>
            </div>
          )}
        </Show>

        <DialogFooter>
          <button
            type='button'
            onClick={props.onClose}
            class='px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
            disabled={isDeleting()}
          >
            Annuler
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={isDeleting()}
            class='px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed'
          >
            {isDeleting() ? 'Suppression...' : 'Supprimer'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

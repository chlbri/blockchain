import type { Asset } from '#features/blockchain/back';
import { displayNumberS } from '#globals/front/helpers/numbers';
import ls from 'localstorage-slim';
import { createMemo, createSignal, onMount } from 'solid-js';
import { CONTRACTS_STORAGE_KEY } from '../create/-services/form/constants';

export const useHooks = () => {
  const [assets, setAssets] = createSignal<Asset[]>([]);
  const [searchTerm, setSearchTerm] = createSignal('');
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [viewSheetOpen, setViewSheetOpen] = createSignal(false);
  const [selectedAsset, setSelectedAsset] = createSignal<Asset | null>(
    null,
  );

  const filtereds = createMemo(() => {
    const term = searchTerm().toLowerCase();
    return assets().filter(
      asset =>
        asset.id.toLowerCase().includes(term) ||
        asset.description.toLowerCase().includes(term) ||
        asset.currency.bank.toLowerCase().includes(term) ||
        asset.currency.display.toLowerCase().includes(term),
    );
  });

  onMount(() => {
    const _storedAssets = ls.get(CONTRACTS_STORAGE_KEY) ?? {};
    const storeAssets = Object.entries(_storedAssets).map(
      ([id, asset]) => ({
        id,
        ...(asset as Omit<Asset, 'id'>),
        value: Number(asset.value),
      }),
    );
    if (storeAssets.length)
      setAssets(current => [...current, ...storeAssets]);
  });

  const totalValue = createMemo(() => {
    return filtereds().reduce((sum, asset) => sum + asset.value, 0);
  });

  const totalValueS = createMemo(() => {
    return displayNumberS(totalValue().toString());
  });

  const mediaCount = (asset: Asset) => {
    const out1 =
      (asset.medias?.photos?.length || 0) +
      (asset.medias?.videos?.length || 0) +
      (asset.medias?.documents?.length || 0);

    const trailingS = out1 !== 1 ? 's' : '';
    const out2 = `${out1} média${trailingS}`;

    return out2;
  };

  const length = createMemo(() => filtereds().length);

  const median = createMemo(() =>
    displayNumberS(
      Math.round(totalValue() / filtereds().length || 0).toString(),
    ),
  );

  const openDeleteDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedAsset(null);
  };

  const openViewSheet = (asset: Asset) => {
    setSelectedAsset(asset);
    setViewSheetOpen(true);
  };

  const closeViewSheet = () => {
    setViewSheetOpen(false);
    setSelectedAsset(null);
  };

  const deleteAsset = async (asset: Asset) => {
    // Remove from localStorage
    const stored = ls.get(CONTRACTS_STORAGE_KEY) ?? {};
    const updatedStored = { ...(stored as Record<string, any>) };
    delete updatedStored[asset.id];
    ls.set(CONTRACTS_STORAGE_KEY, updatedStored);

    // Remove from local state
    setAssets(current => current.filter(a => a.id !== asset.id));
  };

  return {
    filtereds,
    totalValueS,
    searchTerm,
    setSearchTerm,
    mediaCount,
    length,
    median,
    deleteDialogOpen,
    viewSheetOpen,
    selectedAsset,
    openDeleteDialog,
    closeDeleteDialog,
    openViewSheet,
    closeViewSheet,
    deleteAsset,
  };
};

import type { Intermediary } from '#features/blockchain/back';
import ls from 'localstorage-slim';
import { createMemo, createSignal, onMount } from 'solid-js';

export const useHooks = () => {
  const [intermediaries, setIntermediaries] = createSignal<Intermediary[]>(
    [],
  );
  const [searchTerm, setSearchTerm] = createSignal('');
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false);
  const [viewSheetOpen, setViewSheetOpen] = createSignal(false);
  const [selectedIntermediary, setSelectedIntermediary] = createSignal<
    Intermediary | undefined
  >(undefined);

  const filtereds = createMemo(() => {
    const term = searchTerm().toLowerCase();
    return intermediaries().filter(
      intermediary =>
        intermediary.id.toLowerCase().includes(term) ||
        ('name' in intermediary &&
          intermediary.name?.firstName?.toLowerCase().includes(term)) ||
        ('name' in intermediary &&
          intermediary.name?.lastName?.toLowerCase().includes(term)) ||
        ('companyName' in intermediary &&
          intermediary.companyName?.toLowerCase().includes(term)) ||
        intermediary.wallet.toLowerCase().includes(term) ||
        intermediary.contacts.emails?.some(email =>
          email.toLowerCase().includes(term),
        ) ||
        false,
    );
  });

  onMount(() => {
    const _storedIntermediaries = ls.get('intermediaries->') ?? {};
    const storeIntermediaries = Object.entries(_storedIntermediaries).map(
      ([id, intermediary]) => ({
        id,
        ...intermediary,
      }),
    );

    const transformeds = storeIntermediaries.map(intermediary => ({
      id: intermediary.id,
      wallet: intermediary.wallet,
      sacrifice: intermediary.sacrifice,
      personality: intermediary.personality,
      name:
        intermediary.personality === 'individual'
          ? {
              firstName: intermediary.firstName,
              lastName: intermediary.lastName,
            }
          : undefined,
      companyName:
        intermediary.personality === 'company'
          ? intermediary.companyName
          : undefined,
      registrationNumber:
        intermediary.personality === 'company'
          ? intermediary.registrationNumber
          : undefined,
      nationalID:
        intermediary.personality === 'individual'
          ? intermediary.nationalID
          : undefined,
      contacts: {
        phoneNumbers: intermediary.contacts?.phoneNumbers ?? [],
        emails: intermediary.contacts?.emails ?? [],
        socials: intermediary.contacts?.socials ?? [],
        websites: intermediary.contacts?.websites ?? [],
      },
    }));

    if (transformeds.length)
      setIntermediaries(current => [...current, ...transformeds]);
  });

  const contactCount = (intermediary: Intermediary) => {
    const phoneCount = intermediary.contacts.phoneNumbers?.length || 0;
    const emailCount = intermediary.contacts.emails?.length || 0;
    const socialCount = intermediary.contacts.socials?.length || 0;
    const websiteCount = intermediary.contacts.websites?.length || 0;
    const total = phoneCount + emailCount + socialCount + websiteCount;

    const trailingS = total !== 1 ? 's' : '';
    return `${total} contact${trailingS}`;
  };

  const length = createMemo(() => filtereds().length);

  const openDeleteDialog = (intermediary: Intermediary) => {
    setSelectedIntermediary(intermediary);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedIntermediary(undefined);
  };

  const openViewSheet = (intermediary: Intermediary) => {
    setSelectedIntermediary(intermediary);
    setViewSheetOpen(true);
  };

  const closeViewSheet = () => {
    setViewSheetOpen(false);
    setSelectedIntermediary(undefined);
  };

  const deleteIntermediary = async (intermediary: Intermediary) => {
    // Remove from localStorage
    const stored = ls.get('intermediaries->') ?? {};
    const updatedStored = { ...(stored as Record<string, any>) };
    delete updatedStored[intermediary.id];
    ls.set('intermediaries->', updatedStored);

    // Remove from local state
    setIntermediaries(current =>
      current.filter(i => i.id !== intermediary.id),
    );
  };

  return {
    filtereds,
    searchTerm,
    setSearchTerm,
    contactCount,
    length,
    deleteDialogOpen,
    viewSheetOpen,
    selectedIntermediary,
    openDeleteDialog,
    closeDeleteDialog,
    openViewSheet,
    closeViewSheet,
    deleteIntermediary,
  };
};

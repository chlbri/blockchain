import { CURRENCIES } from '#features/blockchain/back';
import { createService } from './-services/main';
import type {
  Asset,
  Currency,
  Intermediary,
} from '#features/blockchain/back/types';
import sleep from '@bemedev/sleep';
import { deepEqual } from 'fast-equals';
import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

// Types pour la démo
export type GameMode = 'with-mandatory' | 'without-mandatory';

export type GameState = {
  selectedAsset?: Asset;
  selectedMode?: GameMode;
  availableIntermediaries: Intermediary[];
  gameStarted: boolean;
};

// Currency par défaut
const DEFAULT_CURRENCY: Currency = CURRENCIES[0];

// Assets de démonstration
export const demoAssets: Record<GameMode, Asset> = {
  'with-mandatory': {
    id: 'asset-mandatory-001',
    description: 'Appartement de luxe - Riviera, Beverlly Hills, 120m²',
    value: 150_000_000,
    currency: DEFAULT_CURRENCY,
    medias: {
      photos: ['paris-apt-1.jpg', 'paris-apt-2.jpg', 'paris-apt-3.jpg'],
      videos: ['paris-apt-tour.mp4'],
      documents: ['paris-apt-dpe.pdf', 'paris-apt-plan.pdf'],
    },
    location: {
      address: 'Riviera 4, Villa 234',
      city: 'Abidjan',
      country: "Côte d'Ivoire",
      coordinates: { lat: 48.8725, lng: 2.2869 },
    },
  },
  'without-mandatory': {
    id: 'asset-standard-001',
    description: 'Maison basse - Grand-Bassam, 150m²',
    value: 29_000_000,
    currency: DEFAULT_CURRENCY,
    medias: {
      photos: ['lyon-house-1.jpg', 'lyon-house-2.jpg'],
      videos: ['lyon-house-tour.mp4'],
    },
    location: {
      address: 'Cité Abraham',
      city: 'Grand-Bassam',
      country: "Côte d'Ivoire",
      coordinates: { lat: 45.764, lng: 4.8357 },
    },
  },
};

// Intermédiaire obligatoire pour le mode "with-mandatory"
export const mandatoryIntermediary: Intermediary = {
  id: 'mandatory-001',
  wallet: '0x1234567890abcdef',
  personality: 'company',
  companyName: 'Notaire Associés SELARL',
  registrationNumber: 'NOTAIRE-75016-001',
  contacts: {
    phoneNumbers: [{ countryCode: +225, number: 759260709 }],
    emails: ['contact@notaire-associes.fr'],
    websites: ['https://notaire-associes.fr'],
  },
};

// Pool de 10 intermédiaires disponibles
export const availableIntermediaries: Intermediary[] = [
  {
    id: 'agent-001',
    wallet: '0xabcd1234567890ef',
    personality: 'individual',
    nationalID: 'FR-ID-001',
    name: { firstName: 'Marie', lastName: "N'GUESSAN" },
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 146789012 }],
      emails: ['marie.dubois@immobilier.fr'],
    },
  },
  {
    id: 'agent-002',
    wallet: '0xef1234567890abcd',
    personality: 'company',
    companyName: 'Century 21 Prestige',
    registrationNumber: 'AGENT-75-001',
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 147890123 }],
      emails: ['contact@century21-prestige.fr'],
    },
  },
  {
    id: 'courtier-001',
    wallet: '0x567890abcdef1234',
    sacrifice: 50_000,
    personality: 'individual',
    nationalID: 'FR-ID-002',
    name: { firstName: 'Pierre', lastName: 'MABRÉ' },
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 148901234 }],
      emails: ['pierre.martin@courtage.fr'],
    },
  },
  {
    id: 'expert-001',
    wallet: '0x890abcdef1234567',
    personality: 'company',
    companyName: 'Expert Immobilier Conseil',
    registrationNumber: 'EXPERT-75-001',
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 149012345 }],
    },
  },
  {
    id: 'promoteur-001',
    wallet: '0xbcdef1234567890a',
    sacrifice: 10_000,
    personality: 'company',
    companyName: 'Promotion Immobilière Moderne',
    registrationNumber: 'PROM-75-001',
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 150123456 }],
      websites: ['https://pim-promo.fr'],
    },
  },
  {
    id: 'gestionnaire-001',
    wallet: '0xdef1234567890abc',
    personality: 'individual',
    nationalID: 'FR-ID-003',
    name: { firstName: 'Lambert', lastName: 'KOUASSI' },
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 151234567 }],
    },
  },
  {
    id: 'syndic-001',
    wallet: '0x234567890abcdef1',
    sacrifice: 75_000,
    personality: 'company',
    companyName: 'Syndic Professionnel Abidjan',
    registrationNumber: 'SYND-75-001',
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 152345678 }],
    },
  },
  {
    id: 'architecte-001',
    wallet: '0x4567890abcdef123',
    personality: 'individual',
    nationalID: 'FR-ID-004',
    name: { firstName: 'Jean-Luc', lastName: 'KOFFI' },
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 153456789 }],
      websites: ['https://archi-moreau.fr'],
    },
  },
  {
    id: 'banquier-001',
    wallet: '0x67890abcdef12345',
    sacrifice: 25_000,
    personality: 'company',
    companyName: 'Crédit Immobilier Spécialisé',
    registrationNumber: 'BANK-75-001',
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 154567890 }],
    },
  },
  {
    id: 'conseiller-001',
    wallet: '0x7890abcdef123456',
    personality: 'individual',
    nationalID: 'FR-ID-005',
    name: { firstName: 'Isabelle', lastName: "N'CHO" },
    contacts: {
      phoneNumbers: [{ countryCode: 225, number: 155678901 }],
      emails: ['isabelle.bernard@conseil-immo.fr'],
    },
  },
];

export const useHooks = () => {
  const {
    start,
    stop,
    select,
    context,
    send,
    matches,
    value,
    addOptions,
  } = createService();

  const [gameState, setGameState] = createSignal<GameState>({
    availableIntermediaries,
    gameStarted: false,
  });

  addOptions(() => ({
    promises: {
      checkOnline: async () => {
        await sleep(100); // Simulation réseau
        return true;
      },
      getIntermediaries: async () => {
        await sleep(200);
        return [];
      },
      addIntermediary: {
        ADD_INTERMEDIARY: async ({ payload }) => {
          await sleep(100); // Simulation blockchain
          return payload;
        },
      },
    },
  }));

  createEffect(() => {
    console.log('State changed:', value());
  });

  const startGame = (mode: GameMode) => {
    const asset = demoAssets[mode];
    setGameState(prev => ({
      ...prev,
      selectedAsset: asset,
      selectedMode: mode,
      gameStarted: true,
    }));

    const startPayload =
      mode === 'with-mandatory'
        ? { asset, mandatory: mandatoryIntermediary }
        : { asset };

    send({ type: 'START', payload: startPayload });
  };

  const addIntermediary = (intermediary: Intermediary) => {
    send({ type: 'ADD_INTERMEDIARY', payload: intermediary });
  };

  const resetGame = () => {
    send('RESET');
    setGameState({
      availableIntermediaries,
      gameStarted: false,
    });
    console.log(
      'Game reset',
      context(ctx => ctx.intermediaries, deepEqual)(),
    );
  };

  onMount(start);
  onCleanup(stop);

  return {
    select,
    context,
    gameState,
    startGame,
    addIntermediary,
    resetGame,
    isIdle: matches('idle'),
    isStarting: matches('checking'),
    isWorking: matches('working'),
    isAdding: matches('working/adding'),
    isReady: matches('working/idle'),
  };
};

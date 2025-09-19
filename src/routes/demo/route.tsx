import {
  DEFAULT_REPARTITIONS,
  dispatch,
  type Asset,
  type Contract,
} from '#features/blockchain/back';
import { createFileRoute } from '@tanstack/solid-router';
import { deepEqual } from 'fast-equals';
import { For, Show, createEffect, createMemo } from 'solid-js';
import { availableIntermediaries, demoAssets, useHooks } from './-hooks';

export const Route = createFileRoute('/demo')({
  component: DemoGame,
});

function DemoGame() {
  const {
    gameState,
    context,
    startGame,
    addIntermediary,
    resetGame,
    isIdle,
    isStarting,
    isAdding,
    isReady,
    select,
  } = useHooks();

  const currentIntermediaries = context(
    ctx => ctx.intermediaries || [],
    deepEqual,
  );

  const currentAsset = context(ctx => ctx.asset, deepEqual);
  const internetStatus = select('context.internetStatus');
  const errors = select('context.errors');

  createEffect(() => {
    console.log('internetStatus', internetStatus());
  });

  createEffect(() => {});

  const computeMaxIntermediaries = (asset?: Asset) => {
    if (!asset) return 3;
    const value = asset.value;
    const max = value > 30_000_000 ? 7 : value > 3_000_000 ? 5 : 3;
    return max;
  };

  const maxIntermediaries = createMemo(() => {
    return computeMaxIntermediaries(currentAsset());
  });

  const canAddMore = createMemo(
    () => currentIntermediaries().length < maxIntermediaries(),
  );

  const commisions = createMemo(() => {
    const current = currentAsset();
    const intermediaries = currentIntermediaries();
    if (!current || intermediaries.length === 0)
      return {} as ReturnType<typeof dispatch>;
    const contract: Contract = {
      asset: current,
      intermediaries: currentIntermediaries(),
      procedure: {
        type: { mode: 'percentage', percentage: 5 },
        repartitions: DEFAULT_REPARTITIONS,
      },
      date: new Date(),
    };

    return dispatch(contract);
  });

  const getIntermediaryRole = (id: string) => {
    switch (true) {
      case id.includes('agent'):
        return '🏠 Agent';
      case id.includes('courtier'):
        return '💼 Courtier';
      case id.includes('expert'):
        return '🔍 Expert';
      case id.includes('promoteur'):
        return '🏗️ Promoteur';
      case id.includes('gestionnaire'):
        return '📋 Gestionnaire';
      case id.includes('syndic'):
        return '🏢 Syndic';
      case id.includes('architecte'):
        return '🏛️ Architecte';
      case id.includes('banquier'):
        return '🏦 Banquier';
      case id.includes('conseiller'):
        return '💡 Conseiller';
      case id.includes('mandatory'):
        return '⚖️ Notaire';
      default:
        return '👤 Intermédiaire';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
    }).format(value);
  };

  return (
    <div class='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6'>
      <div class='max-w-6xl mx-auto'>
        {/* Header */}
        <div class='text-center mb-8'>
          <h1 class='text-4xl font-bold text-slate-900 dark:text-white mb-4'>
            🎮 Démonstration Interactive de la Blockchain
          </h1>
          <p class='text-lg text-gray-700 dark:text-gray-300 mb-6'>
            Découvrez comment fonctionne notre système de distribution de
            commissions
          </p>

          {/* Configuration par défaut */}
          <Show when={!gameState().gameStarted}>
            <div class='bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 shadow-md'>
              <h3 class='text-xl font-semibold text-slate-900 dark:text-white mb-4'>
                ⚙️ Configuration par défaut
              </h3>
              <div class='grid lg:grid-cols-2 gap-6 text-left'>
                <div class='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex flex-col items-center justify-center'>
                  <h4 class='font-semibold text-blue-600 dark:text-blue-400 mb-2'>
                    💰 Commission totale
                  </h4>
                  <p class='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    5%
                  </p>
                  <p class='text-sm text-gray-600 dark:text-gray-400'>
                    De la valeur du bien
                  </p>
                </div>

                <div class='bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm'>
                  <h4 class='font-semibold text-green-600 dark:text-green-400 mb-3'>
                    📊 Clé de répartitions
                  </h4>
                  <div class='space-y-2 text-sm'>
                    <For each={DEFAULT_REPARTITIONS}>
                      {(repartition, index) => (
                        <div class='flex justify-between items-center'>
                          <span class='text-gray-700 dark:text-gray-300'>
                            {index() + 1} intermédiaire
                            {index() > 0 ? 's' : ''}:
                          </span>
                          <div class='flex gap-2'>
                            <For each={repartition}>
                              {percentage => (
                                <span class='bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-1 px-1.5 rounded text-xs font-medium'>
                                  {percentage}%
                                </span>
                              )}
                            </For>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </div>

              <p class='text-sm text-gray-600 dark:text-gray-400 mt-4 italic'>
                Les répartitions s'ajustent automatiquement selon le nombre
                d'intermédiaires dans la chaîne
              </p>
            </div>
          </Show>
        </div>

        {/* Status Bar */}
        <Show when={gameState().gameStarted}>
          <div class='bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-lg'>
            <div class='flex items-center justify-between flex-wrap gap-4'>
              <div class='flex items-center gap-4'>
                <div class='flex items-center gap-2'>
                  <div
                    class={`w-3 h-3 rounded-full ${internetStatus() ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span class='text-sm font-medium'>
                    {internetStatus() ? '🌐 En ligne' : '❌ Hors ligne'}
                  </span>
                </div>
                <div class='flex items-center gap-2'>
                  <span class='text-sm font-medium'>État:</span>
                  <span
                    class={`px-2 py-1 rounded text-xs font-bold ${
                      isIdle()
                        ? 'bg-gray-200 text-gray-800'
                        : isStarting()
                          ? 'bg-yellow-200 text-yellow-800'
                          : isAdding()
                            ? 'bg-blue-200 text-blue-800'
                            : isReady()
                              ? 'bg-green-200 text-green-800'
                              : 'bg-gray-200'
                    }`}
                  >
                    {isIdle()
                      ? 'Inactif'
                      : isStarting()
                        ? 'Initialisation...'
                        : isAdding()
                          ? 'Ajout en cours...'
                          : isReady()
                            ? 'Prêt'
                            : 'Traitement...'}
                  </span>
                </div>
              </div>
              <button
                onClick={resetGame}
                class='px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors'
              >
                🔄 Redémarrer
              </button>
            </div>
          </div>
        </Show>

        {/* Game Start Screen */}
        <Show when={!gameState().gameStarted}>
          <div class='bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg'>
            <h2 class='text-2xl font-semibold text-center mb-8 text-slate-900 dark:text-white'>
              Choisissez votre type de transaction
            </h2>

            <div class='grid md:grid-cols-2 gap-8'>
              <button
                onClick={() => startGame('with-mandatory')}
                class='p-6 border-2 border-blue-200 hover:border-blue-400 dark:border-blue-700 dark:hover:border-blue-500 rounded-xl transition-all hover:shadow-lg group'
              >
                <div class='text-center'>
                  <div class='text-4xl mb-4'>⚖️</div>
                  <h3 class='text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                    Avec un mandataire
                  </h3>
                  <p class='text-gray-600 dark:text-gray-400 mb-4'>
                    {demoAssets['with-mandatory'].description}
                  </p>
                  <div class='bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg'>
                    <p class='font-semibold text-blue-800 dark:text-blue-300'>
                      Valeur:{' '}
                      {formatCurrency(demoAssets['with-mandatory'].value)}
                    </p>
                    <p class='text-sm text-blue-600 dark:text-blue-400'>
                      Max{' '}
                      {computeMaxIntermediaries(
                        demoAssets['with-mandatory'],
                      )}{' '}
                      intermédiaires
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => startGame('without-mandatory')}
                class='p-6 border-2 border-green-200 hover:border-green-400 dark:border-green-700 dark:hover:border-green-500 rounded-xl transition-all hover:shadow-lg group'
              >
                <div class='text-center'>
                  <div class='text-4xl mb-4'>🏠</div>
                  <h3 class='text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400'>
                    Sans Intermédiaire Obligatoire
                  </h3>
                  <p class='text-gray-600 dark:text-gray-400 mb-4'>
                    {demoAssets['without-mandatory'].description}
                  </p>
                  <div class='bg-green-50 dark:bg-green-900/20 p-3 rounded-lg'>
                    <p class='font-semibold text-green-800 dark:text-green-300'>
                      Valeur:{' '}
                      {formatCurrency(
                        demoAssets['without-mandatory'].value,
                      )}
                    </p>
                    <p class='text-sm text-green-600 dark:text-green-400'>
                      Max{' '}
                      {computeMaxIntermediaries(
                        demoAssets['without-mandatory'],
                      )}{' '}
                      intermédiaires
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div class='mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg'>
              <h4 class='font-semibold mb-2 text-slate-900 dark:text-white'>
                ℹ️ Comment ça marche :
              </h4>
              <ul class='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                <li>• Choisissez un type de transaction pour commencer</li>
                <li>
                  • Ajoutez des intermédiaires avec les boutons disponibles
                </li>
                <li>
                  • Observez la machine blockchain traiter chaque ajout
                </li>
                <li>• Explorez les limites selon la valeur de l'asset</li>
              </ul>
            </div>
          </div>
        </Show>

        {/* Game Interface */}
        <Show when={gameState().gameStarted}>
          <div class='space-y-6'>
            {/* Asset Information */}
            <Show when={currentAsset()}>
              {asset => (
                <div class='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
                  <h3 class='text-xl font-semibold mb-4 text-slate-900 dark:text-white'>
                    🏠 Asset sélectionné
                  </h3>
                  <div class='grid md:grid-cols-2 gap-4'>
                    <div>
                      <p class='font-medium text-gray-900 dark:text-gray-100'>
                        {asset().description}
                      </p>
                      <p class='text-lg font-bold text-green-600 mt-2'>
                        {formatCurrency(asset().value)}
                      </p>
                      <Show when={asset().location}>
                        <p class='text-sm text-gray-600 dark:text-gray-400 mt-1'>
                          📍 {asset().location!.city},{' '}
                          {asset().location!.country}
                        </p>
                      </Show>
                    </div>
                    <div class='text-right'>
                      <p class='text-sm text-gray-600 dark:text-gray-400'>
                        Intermédiaires: {currentIntermediaries().length} /{' '}
                        {maxIntermediaries()}
                      </p>
                      <div class='w-full bg-gray-200 rounded-full h-2 mt-2'>
                        <div
                          class='bg-blue-600 h-2 rounded-full transition-all duration-300'
                          style={`width: ${(currentIntermediaries().length / maxIntermediaries()) * 100}%`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Show>

            {/* Current Intermediaries */}
            <Show when={currentIntermediaries().length > 0}>
              <div class='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
                <h3 class='text-xl font-semibold mb-4 text-slate-900 dark:text-white'>
                  👥 Intermédiaires dans la chaîne
                </h3>
                <div class='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  <For each={currentIntermediaries()}>
                    {(intermediary, index) => (
                      <div class='border border-gray-200 dark:border-gray-600 rounded-lg p-4'>
                        <div class='flex items-center justify-between mb-2'>
                          <span class='text-lg'>
                            {getIntermediaryRole(intermediary.id)}
                          </span>
                          <span class='text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded'>
                            #{index() + 1}
                          </span>
                        </div>
                        <p class='font-medium text-sm text-gray-900 dark:text-gray-100'>
                          {intermediary.personality === 'individual'
                            ? `${intermediary.name.firstName || ''} ${intermediary.name.lastName}`
                            : intermediary.companyName}
                        </p>
                        <Show when={intermediary.sacrifice}>
                          <p class='text-xs text-orange-600 dark:text-orange-400 mt-1'>
                            💰 Sacrifice:{' '}
                            {formatCurrency(intermediary.sacrifice ?? 0)}
                          </p>
                        </Show>
                        <p class='text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono'>
                          {intermediary.wallet.slice(0, 10)}...
                        </p>
                        <p class='text-sm text-green-600 dark:text-green-400 font-semibold mt-2'>
                          Commission estimée:{' '}
                          {commisions().distribution[index()]
                            ? formatCurrency(
                                commisions().distribution[index()].amount,
                              )
                            : 'Calcul en cours...'}
                        </p>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </Show>

            {/* Available Intermediaries */}
            <Show when={canAddMore() && isReady()}>
              <div class='bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg'>
                <h3 class='text-xl font-semibold mb-4 text-slate-900 dark:text-white'>
                  ➕ Ajouter un intermédiaire
                </h3>
                <div class='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'>
                  <For each={availableIntermediaries}>
                    {intermediary => (
                      <button
                        onClick={() => addIntermediary(intermediary)}
                        disabled={
                          isAdding() ||
                          currentIntermediaries().some(
                            inter => inter.id === intermediary.id,
                          ) ||
                          !canAddMore()
                        }
                        class='p-3 border border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group'
                      >
                        <div class='text-center'>
                          <div class='text-2xl mb-2'>
                            {
                              getIntermediaryRole(intermediary.id).split(
                                ' ',
                              )[0]
                            }
                          </div>
                          <p class='text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'>
                            {intermediary.personality === 'individual'
                              ? `${intermediary.name.firstName || ''} ${intermediary.name.lastName}`
                              : intermediary.companyName
                                  .split(' ')
                                  .slice(0, 2)
                                  .join(' ')}
                          </p>
                          <Show when={intermediary.sacrifice}>
                            <p class='text-xs text-orange-500 mt-1'>
                              💰{' '}
                              {formatCurrency(intermediary.sacrifice ?? 0)}
                            </p>
                          </Show>
                        </div>
                      </button>
                    )}
                  </For>
                </div>
                <Show when={!canAddMore()}>
                  <p class='text-center text-gray-500 dark:text-gray-400 mt-4 italic'>
                    Nombre maximum d'intermédiaires atteint (
                    {maxIntermediaries()})
                  </p>
                </Show>
              </div>
            </Show>

            {/* Debug Info - Temporary */}
            <div class='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4'>
              <h4 class='font-semibold text-yellow-800 dark:text-yellow-300 mb-2'>
                🔍 Debug Info:
              </h4>
              <div class='text-sm space-y-1'>
                <p>
                  Game Started: {gameState().gameStarted ? 'Yes' : 'No'}
                </p>
                <p>Is Ready: {isReady() ? 'Yes' : 'No'}</p>
                <p>Can Add More: {canAddMore() ? 'Yes' : 'No'}</p>
                <p>
                  Current Intermediaries: {currentIntermediaries().length}
                </p>
                <p>Max Intermediaries: {maxIntermediaries()}</p>
                <p>
                  Available Intermediaries:{' '}
                  {availableIntermediaries.length}
                </p>
                <p>
                  Show Buttons Condition:{' '}
                  {canAddMore() && isReady() ? 'Yes' : 'No'}
                </p>
              </div>
            </div>

            {/* Errors Display */}
            <Show
              when={errors() && Object.values(errors()!).some(Boolean)}
            >
              <div class='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4'>
                <h4 class='font-semibold text-red-800 dark:text-red-300 mb-2'>
                  ❌ Erreurs :
                </h4>
                <For
                  each={Object.entries(errors()!).filter(([, value]) =>
                    Boolean(value),
                  )}
                >
                  {([, value]) => (
                    <p class='text-sm text-red-600 dark:text-red-400'>
                      •{' '}
                      {typeof value === 'string'
                        ? value
                        : JSON.stringify(value)}
                    </p>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </Show>
      </div>
    </div>
  );
}

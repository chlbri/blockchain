import { createFileRoute, Link } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: () => {
    return (
      <div class='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-3'>
        <div class='max-w-4xl mx-auto px-8'>
          <h1 class='text-6xl font-bold underline underline-offset-8 text-yellow-900 dark:text-white py-8 font-sans'>
            BLOCK-IMMO
          </h1>
          <p class='italic text-xl'>(La plateforme est en chantier ...)</p>

          {/* Bouton de démonstration */}
          <div class='my-8'>
            <Link
              to='/demo'
              class='inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'
            >
              <span class='text-2xl'>🎮</span>
              <div class='text-left'>
                <div class='text-lg'>Essayer la Démonstration</div>
                <div class='text-sm opacity-90'>
                  Découvrez le système interactif
                </div>
              </div>
            </Link>
          </div>

          <h2 class='text-4xl font-bold text-slate-900 dark:text-white py-8'>
            Plateforme Blockchain pour l'Immobilier
          </h2>

          <div class='space-y-6 text-gray-700 dark:text-gray-300'>
            <p class='text-xl font-medium'>
              Transparence et équité dans la chaîne de valeur immobilière
            </p>

            <p class='text-lg leading-relaxed'>
              Notre plateforme révolutionne la distribution des commissions
              dans l'écosystème immobilier en utilisant la technologie
              blockchain. Elle garantit une répartition équitable et
              transparente entre tous les intermédiaires de la chaîne de
              valeur.
            </p>

            <div class='grid md:grid-cols-2 gap-6 mt-8'>
              <div class='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 class='text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3'>
                  🔗 Transparence Blockchain
                </h3>
                <p class='text-gray-600 dark:text-gray-400'>
                  Chaque transaction est enregistrée de manière immuable,
                  assurant une traçabilité complète des commissions
                  versées.
                </p>
              </div>

              <div class='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 class='text-xl font-semibold text-green-600 dark:text-green-400 mb-3'>
                  ⚖️ Équité Garantie
                </h3>
                <p class='text-gray-600 dark:text-gray-400'>
                  Algorithmes automatisés pour une distribution juste basée
                  sur la contribution réelle de chaque intermédiaire.
                </p>
              </div>

              <div class='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 class='text-xl font-semibold text-purple-600 dark:text-purple-400 mb-3'>
                  🏢 Écosystème Immobilier
                </h3>
                <p class='text-gray-600 dark:text-gray-400'>
                  Connecte agents, courtiers, notaires et autres
                  professionnels dans un réseau de confiance décentralisé.
                </p>
              </div>

              <div class='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
                <h3 class='text-xl font-semibold text-orange-600 dark:text-orange-400 mb-3'>
                  🚀 Innovation Technologique
                </h3>
                <p class='text-gray-600 dark:text-gray-400'>
                  Smart contracts automatisent les paiements et éliminent
                  les intermédiaires superflus pour réduire les coûts.
                </p>
              </div>
            </div>

            <div class='bg-blue-50 dark:bg-gray-800 p-6 rounded-lg mt-8'>
              <h3 class='text-2xl font-semibold text-slate-900 dark:text-white mb-4'>
                Pourquoi notre plateforme ?
              </h3>
              <ul class='space-y-3'>
                <li class='flex items-start'>
                  <span class='text-blue-500 mr-3'>✓</span>
                  <span>
                    Élimination des conflits liés à la répartition des
                    commissions
                  </span>
                </li>
                <li class='flex items-start'>
                  <span class='text-blue-500 mr-3'>✓</span>
                  <span>
                    Réduction des délais de paiement grâce à
                    l'automatisation
                  </span>
                </li>
                <li class='flex items-start'>
                  <span class='text-blue-500 mr-3'>✓</span>
                  <span>
                    Audit permanent et vérifiable de toutes les
                    transactions
                  </span>
                </li>
              </ul>
            </div>

            <p class='text-center text-gray-600 dark:text-gray-400 mt-8 italic'>
              Utilisez la navigation pour explorer les différentes
              fonctionnalités et découvrir comment notre solution
              transforme le secteur immobilier.
            </p>

            {/* Call to action vers la démo */}
            <div class='text-center mt-12'>
              <Link
                to='/demo'
                class='inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200'
              >
                <span class='text-xl'>🚀</span>
                Tester la Démonstration Interactive
              </Link>
              <p class='text-sm text-gray-500 dark:text-gray-400 mt-2'>
                Expérimentez notre système de distribution de commissions
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

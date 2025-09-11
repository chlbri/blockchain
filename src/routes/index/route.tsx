import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/')({
  component: () => {
    return (
      <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 pt-3">
        <h1 class="text-4xl font-bold text-slate-900 dark:text-white p-8">
          Welcome to the Blockchain Commission Distribution Demo!
        </h1>
        <p class="text-lg text-gray-700 dark:text-gray-300 px-8">
          This application showcases a blockchain-based commission
          distribution system for intermediaries.
        </p>
        <p class="text-md text-gray-600 dark:text-gray-400 px-8 mt-4">
          Use the navigation to explore different features and
          functionalities.
        </p>
      </div>
    );
  },
});

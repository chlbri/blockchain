import { createFileRoute } from '@tanstack/solid-router';
import { createSignal } from 'solid-js';

export const Route = createFileRoute('/auth/register')({
  component: () => {
    const [email, setEmail] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      if (password() !== confirmPassword()) {
        alert('Les mots de passe ne correspondent pas');
        return;
      }
      // TODO: Implement registration logic
      console.log('Registration attempt:', {
        email: email(),
        password: password(),
      });
    };

    return (
      <div class='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
        <div class='bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md'>
          <h1 class='text-2xl font-bold text-center text-gray-900 dark:text-white mb-6'>
            Inscription
          </h1>
          <form onSubmit={handleSubmit} class='space-y-4'>
            <div>
              <label
                for='email'
                class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                value={email()}
                onInput={e => setEmail(e.currentTarget.value)}
                class='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label
                for='password'
                class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Mot de passe
              </label>
              <input
                type='password'
                id='password'
                value={password()}
                onInput={e => setPassword(e.currentTarget.value)}
                class='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <div>
              <label
                for='confirmPassword'
                class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
              >
                Confirmer le mot de passe
              </label>
              <input
                type='password'
                id='confirmPassword'
                value={confirmPassword()}
                onInput={e => setConfirmPassword(e.currentTarget.value)}
                class='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white'
                required
              />
            </div>
            <button
              type='submit'
              class='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200'
            >
              S'inscrire
            </button>
          </form>
          <p class='text-center text-sm text-gray-600 dark:text-gray-400 mt-4'>
            Déjà un compte ?{' '}
            <a
              href='/auth/login'
              class='text-blue-600 hover:text-blue-800'
            >
              Se connecter
            </a>
          </p>
        </div>
      </div>
    );
  },
});

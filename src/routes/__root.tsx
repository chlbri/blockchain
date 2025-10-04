/// <reference types="vite/client" />

import HeadLinks from '#components/organisms/HeadLinks';
import { NotFound as notFoundComponent } from '#components/pages/NotFound';
import appCss from '#styles/app.css?url';
import { createRootRoute, Outlet } from '@tanstack/solid-router';
import { TanStackRouterDevtools } from '@tanstack/solid-router-devtools';
import seo from 'src/globals/front/helpers/seo';

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Demo for Blockchain | by @chlbri',
        description: `A demo application showcasing a blockchain-based commission distribution system for intermediaries.`,
        keywords:
          'blockchain, intermediaries, commission, distribution, smart contracts, demo',
      }),
    ],
  }),
  notFoundComponent,
  errorComponent: ({ error }) => (
    <div class='min-h-screen flex flex-col items-center justify-center bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-100 p-4'>
      <h1 class='text-4xl font-bold mb-4'>Something went wrong!</h1>
      <pre class='bg-white dark:bg-gray-800 p-4 rounded shadow overflow-x-auto max-w-full'>
        {error.message}
      </pre>
    </div>
  ),
  pendingComponent: () => (
    <div class='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100'>
      <div class='ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32'>
        Loading ....
      </div>
    </div>
  ),
  component: () => {
    return (
      <>
        <HeadLinks />
        <main class='w-full min-h-full text-center'>
          <Outlet />
        </main>
        <TanStackRouterDevtools position='bottom-left' />
      </>
    );
  },
});

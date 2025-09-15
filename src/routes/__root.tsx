/// <reference types="vite/client" />

import HeadLinks from '#components/organisms/HeadLinks';
import { NotFound } from '#components/pages/NotFound';
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
  notFoundComponent: NotFound,
  shellComponent: () => {
    // onCleanup(stop);
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

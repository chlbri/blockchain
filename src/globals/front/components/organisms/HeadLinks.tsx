import { createLinks, formatLabel1 as formatLabel } from '#signals/links';
import { Link as _Link } from '@tanstack/solid-router';
import { For, type Component } from 'solid-js';
import type { PropsOf } from '../../types';

type LinkProps = Omit<
  ReturnType<typeof createLinks>[number],
  'children' | 'search'
> & { search?: (val: string) => string } & PropsOf<
    typeof _Link,
    'children'
  >;

const Link: Component<LinkProps> = ({ children, to, search }) => {
  return (
    <_Link
      to={to}
      search={search?.(to)}
      class={'text-gray-400 hover:underline hover:scale-105'}
      activeProps={{
        class:
          'text-yellow-900 font-semibold hover:no-underline! hover:scale-100! cursor-default text-xl',
      }}
      activeOptions={{ exact: true }}
    >
      {children}
    </_Link>
  );
};

const HeadLinks: Component = () => {
  const LINKS = createLinks({
    // filter: value => value === '/projects' || !value.includes('projects'),
    filter: value => !value.includes('/$id'),
    formatLabel,
  });

  return (
    <header class='p-2 flex gap-2 text-lg justify-center w-full space-x-2 sticky top-0 bg-white/20 backdrop-blur-md z-10 border-b border-gray-200 dark:bg-gray-900/20 dark:border-gray-700'>
      <For each={LINKS} children={Link} />
    </header>
  );
};

export default HeadLinks;

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
    formatLabel,
  });

  return (
    <header class='p-2 flex gap-2 text-lg justify-center w-full space-x-2'>
      <For each={LINKS} children={Link} />
    </header>
  );
};

export default HeadLinks;

import type { ErrorComponentProps } from '@tanstack/solid-router';
import {
  ErrorComponent,
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/solid-router';
import type { Component } from 'solid-js';

export const DefaultCatchBoundary: Component<ErrorComponentProps> = ({
  error,
}) => {
  const router = useRouter();
  const isRoot = useMatch({
    strict: false,
    select: ({ id }) => id === rootRouteId,
  });

  console.error('DefaultCatchBoundary Error:', error);

  return (
    <div class='min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6'>
      <ErrorComponent error={error} />
      <div class='flex gap-2 items-center flex-wrap'>
        <button
          onClick={() => {
            router.invalidate();
          }}
          class={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
        >
          Try Again
        </button>
        {isRoot() ? (
          <Link
            to='/'
            class={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
          >
            Home
          </Link>
        ) : (
          <Link
            to='/'
            class={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
            onClick={e => {
              e.preventDefault();
              window.history.back();
            }}
          >
            Go Back
          </Link>
        )}
      </div>
    </div>
  );
};

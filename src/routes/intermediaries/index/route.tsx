import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/intermediaries/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/intermediaries/"!</div>;
}

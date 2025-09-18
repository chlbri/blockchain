import { createFileRoute } from '@tanstack/solid-router';

export const Route = createFileRoute('/how-it-works')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/how-it-works/routes"!</div>;
}

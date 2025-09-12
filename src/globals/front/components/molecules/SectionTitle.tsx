import type { Component } from 'solid-js';

export const SectionTitle: Component<{
  emphase: string;
  normal: string;
}> = ({ emphase, normal }) => (
  <div class='w-full justify-center flex'>
    <h2 class='font-sans text-3xl md:text-5xl font-bold text-foreground mb-6 flex min-w-max mx-auto space-x-3'>
      <span>{normal}</span>
      <span class='block text-primary'>{emphase}</span>
    </h2>
  </div>
);

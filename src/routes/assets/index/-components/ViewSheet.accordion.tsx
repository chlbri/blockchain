import { Accordion as AccordionD } from '#cn-comp/accordion';
import { For, Show, type Accessor, type Component } from 'solid-js';

export type AccordionData = { title: string; items?: string[] };

const Item: Component<AccordionData & { index: Accessor<number> }> = ({
  title,
  items,
  index,
}) => {
  const len = items?.length ?? 0;

  return (
    <AccordionD.Item
      value={`${title} - ${index()}`}
      class='bg-gray-50 dark:bg-gray-800 p-2 rounded-lg space-y-3'
    >
      <AccordionD.Trigger class='cursor-pointer'>
        <h4 class='font-medium text-gray-900 dark:text-white'>
          {`${title} (${len})`}
        </h4>
      </AccordionD.Trigger>
      <AccordionD.Content>
        <Show
          when={len > 0}
          fallback={
            <p class='text-xs text-gray-500 dark:text-gray-400 italic'>
              Aucune vidéo
            </p>
          }
        >
          <div class='space-y-2'>
            <For each={items}>
              {(item, index) => (
                <div class='flex items-center gap-2 bg-white dark:bg-gray-700 p-2 rounded'>
                  <span class='text-sm text-gray-600 dark:text-gray-400'>
                    {index() + 1}.
                  </span>
                  <span class='text-sm text-gray-900 dark:text-white truncate flex-1'>
                    {item}
                  </span>
                </div>
              )}
            </For>
          </div>
        </Show>
      </AccordionD.Content>
    </AccordionD.Item>
  );
};

export const AccordionSheet: Component<{ data: AccordionData[] }> = ({
  data,
}) => {
  return (
    <AccordionD
      collapsible
      class='mx-auto min-w-md flex flex-col space-y-3'
    >
      <For
        each={data}
        children={(data, index) => {
          const props = { ...data, index };
          return <Item {...props} />;
        }}
      />
    </AccordionD>
  );
};

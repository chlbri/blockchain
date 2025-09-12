import type { Component } from 'solid-js';

export const ButtonUpdate: Component<{
  onClick: () => void;
  size?: 'small' | 'medium' | 'large';
}> = ({ onClick, size = 'medium' }) => {
  const sizeClasses = {
    small: 'size-8',
    medium: 'size-10',
    large: 'size-12',
  };

  return (
    <button
      onClick={onClick}
      type='button'
      class='bg-slate-50 hover:bg-slate-100 items-center p-1 text-blue-600 hover:text-blue-800 font-medium rounded-full transition-all duration-200 active:scale-90 shadow-xl active:shadow-md cursor-pointer border-2 border-slate-200 group'
    >
      <svg
        class='group-active:rotate-180 transition-all duration-200 ease-in-out'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
        style={{
          'will-change': 'transform',
        }}
        classList={{
          [sizeClasses[size]]: true,
        }}
      >
        <path
          stroke-linecap='round'
          stroke-linejoin='round'
          stroke-width='2.5'
          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
        />
      </svg>
    </button>
  );
};

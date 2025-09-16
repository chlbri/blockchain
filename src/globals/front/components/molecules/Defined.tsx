import { createMemo, Show, type Accessor, type JSX } from 'solid-js';

type _Props<T> = {
  extraCheck?: (data: NonNullable<T>) => boolean;
  children: ((data: NonNullable<T>) => JSX.Element) | JSX.Element;
  fallback?: JSX.Element;
};

type Props<T> = _Props<T> & {
  data: T;
};

type Props2<T> = _Props<T> & {
  data?: Accessor<T>;
};

export function Defined<T>({
  data,
  children,
  extraCheck,
  fallback,
}: Props<T>) {
  const isDefined = createMemo(
    () => !!data && extraCheck?.(data) !== false,
  );
  return (
    <Show when={isDefined()} fallback={fallback}>
      {typeof children === 'function' ? children(data!) : children}
    </Show>
  );
}

Defined.WithAccessor = function <T>({
  data,
  children,
  extraCheck,
  fallback,
}: Props2<T>) {
  const isDefined = createMemo(() => {
    if (!data) return false;
    const _data = data();
    return (
      _data !== undefined &&
      _data !== null &&
      extraCheck?.(_data) !== false
    );
  });

  return (
    <Show fallback={fallback} when={isDefined()}>
      {typeof children === 'function' ? children(data!()!) : children}
    </Show>
  );
};

Defined.WithA = Defined.WithAccessor;

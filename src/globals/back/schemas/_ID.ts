import * as v from 'valibot';

export const _ID = v.message(
  v.pipe(
    v.string(),
    v.nanoid(),
    v.description('schemas._ID._self.description'),
  ),
  'schemas._ID._self.error',
);
export type _ID = v.InferOutput<typeof _ID>;

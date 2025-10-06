import * as v from 'valibot';

export const File = v.object({
  url: v.string('schemas.file._props.url._self.error'),
  size: v.pipe(
    v.number('schemas.file._props.size._self.error'),
    v.description('schemas.file._props.size._self.description'),
  ),
  tag: v.pipe(
    v.optional(v.string('schemas.file._props.tag._self.error')),
    v.description('schemas.file._props.tag._self.description'),
  ),
});
export type File = v.InferOutput<typeof File>;

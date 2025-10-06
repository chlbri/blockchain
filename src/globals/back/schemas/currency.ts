import * as v from 'valibot';

export const Currency = v.object({
  display: v.pipe(
    v.string('schemas.currency._props.display._self.error'),
    v.description('schemas.currency._props.display._self.description'),
  ),

  code: v.pipe(
    v.string('schemas.currency._props.code._self.errors.type'),
    v.length(3, 'schemas.currency._props.code._self.errors.length_3'),
    v.description('schemas.currency._props.code._self.description'),
  ),

  description: v.pipe(
    v.optional(
      v.string('schemas.currency._props.description._self.error'),
    ),
    v.description('schemas.currency._props.description._self.description'),
  ),
});
export type Currency = v.InferOutput<typeof Currency>;

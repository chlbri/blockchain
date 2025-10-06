import * as v from 'valibot';

export const Country = v.object({
  // TODO: choose to integrate or not :
  //  name: v.string(),
  code: v.pipe(
    v.string('schemas.country._props.code._self.errors.type'),
    v.length(3, 'schemas.country._props.code._self.errors.length_3'),
    v.description('schemas.country._props.code._self.description'),
  ),
  description: v.pipe(
    v.optional(v.string('schemas.country._props.description._self.error')),
    v.description('schemas.country._props.description._self.description'),
  ),
});
export type Country = v.InferOutput<typeof Country>;

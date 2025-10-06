import * as v from 'valibot';

export const Platform = v.object({
  name: v.string('schemas.platform._props.name._self.error'),
  url: v.pipe(
    v.string('schemas.platform._props.url._self.error'),
    v.url('schemas.platform._props.url._self.errors.url'),
    v.description('schemas.platform._props.url._self.description'),
  ),
});
export type Platform = v.InferOutput<typeof Platform>;

export const Social = v.object({
  platform: Platform,
  ID: v.optional(v.string('schemas.social._props.ID._self.error')),
  url: v.pipe(
    v.string('schemas.social._props.url._self.error'),
    v.url('schemas.social._props.url._self.errors.url'),
    v.description('schemas.social._props.url._self.description'),
  ),
  description: v.pipe(
    v.optional(v.string('schemas.social._props.description._self.error')),
    v.description('schemas.social._props.description._self.description'),
  ),
});
export type Social = v.InferOutput<typeof Social>;

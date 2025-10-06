import * as v from 'valibot';

export const PhoneNumber = v.object({
  countryCode: v.pipe(
    v.number(),
    v.minValue(1),
    v.maxValue(999),
    v.description(
      'schemas.phoneNumber._props.countryCode._self.description',
    ),
  ),

  number: v.pipe(
    v.string('schemas.phoneNumber._props.number._self.error'),
    v.minLength(4, 'schemas.phoneNumber._props.number._self.errors.min_4'),
    v.maxLength(
      15,
      'schemas.phoneNumber._props.number._self.errors.max_15',
    ),
  ),

  network: v.pipe(
    v.optional(v.string('schemas.phoneNumber._props.network._self.error')),
    v.description('schemas.phoneNumber._props.network._self.description'),
  ),
});
export type PhoneNumber = v.InferOutput<typeof PhoneNumber>;

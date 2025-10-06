import * as v from 'valibot';
import { Country } from './country';

export const Coordinates = v.object({
  longitude: v.number('schemas.coordinates._props.longitude._self.error'),
  latitude: v.number('schemas.coordinates._props.latitude._self.error'),
  seaDepth: v.pipe(
    v.optional(
      v.number('schemas.coordinates._props.seaDepth._self.error'),
    ),
    v.description('schemas.coordinates._props.seaDepth._self.description'),
  ),
});
export type Coordinates = v.InferOutput<typeof Coordinates>;

export const Location = v.object({
  city: v.string('schemas.location._props.city._self.error'),
  country: Country,
  coordinates: Coordinates,

  precisions: v.pipe(
    v.optional(v.string('schemas.location._props.precisions._self.error')),
    v.description('schemas.location._props.precisions._self.description'),
  ),

  googleMaps: v.pipe(
    v.optional(v.string('schemas.location._props.googleMaps._self.error')),
    v.description('schemas.location._props.googleMaps._self.description'),
  ),
});
export type Location = v.InferOutput<typeof Location>;

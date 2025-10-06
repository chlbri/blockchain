import { CURRENCIES } from '#globals/back/constants/currencies';
import { _ID, File, Location } from '#globals/back/schemas';
import * as v from 'valibot';

const BaseAsset = v.pipe(
  v.object({
    id: _ID,
    location: Location,

    currency: v.pipe(
      v.string('schemas.assets.base._props.currency._self.errors.type'),
      v.check(
        code => CURRENCIES.some(c => c.code === code),
        'schemas.assets.base._props.currency._self.errors.invalid',
      ),
    ),

    name: v.pipe(
      v.string('schemas.assets.base._props.name._self.errors.type'),
      v.minLength(
        6,
        'schemas.assets.base._props.name._self.errors.minLength_6',
      ),
    ),

    description: v.optional(
      v.string('schemas.assets.base._props.description._self.error'),
    ),

    medias: v.pipe(
      v.optional(
        v.record(
          v.union(
            [
              v.literal('photos'),
              v.literal('videos'),
              v.literal('documents'),
            ],
            'schemas.assets.base._props.medias._keys.error',
          ),
          v.pipe(
            v.array(
              File,
              'schemas.assets.base._props.medias._values.errors.type',
            ),
            v.minLength(
              1,
              'schemas.assets.base._props.medias._values.errors.minLength_1',
            ),
          ),
        ),
      ),
      v.description('schemas.assets.base._props.medias.description'),
    ),

    width: v.pipe(
      v.number('schemas.assets.base._props.width._self.errors.type'),
      v.minValue(
        0,
        'schemas.assets.base._props.width._self.errors.minValue_0',
      ),
      v.description('schemas.assets.base._props.width._self.description'),
    ),

    length: v.pipe(
      v.number('schemas.assets.base._props.length._self.errors.type'),
      v.minValue(
        0,
        'schemas.assets.base._props.length._self.errors.minValue_0',
      ),
      v.description('schemas.assets.base._props.length._self.description'),
    ),
  }),

  v.transform(asset => ({
    ...asset,
    currency: CURRENCIES.find(c => c.code === asset.currency)!,
    area: asset.width * asset.length,
  })),
);

export const Standing = v.pipe(
  v.union(
    [
      v.literal('standard'),
      v.literal('comfortable'),
      v.literal('high standing'),
      v.literal('luxury'),
    ],
    'schemas.assets.standing.error',
  ),
  v.description('schemas.assets.standing.description'),
);
export type Standing = v.InferOutput<typeof Standing>;

const BaseRoomSchema = v.pipe(
  v.object({
    name: v.pipe(
      v.optional(
        v.pipe(
          v.string('schemas.assets.room._props.name._self.errors.type'),
          v.minLength(
            3,
            'schemas.assets.room._props.name._self.errors.minLength_3',
          ),
        ),
      ),
      v.description('schemas.assets.room._props.name._self.description'),
    ),

    width: v.pipe(
      v.number('schemas.assets.room._props.width._self.errors.type'),
      v.minValue(
        0,
        'schemas.assets.room._props.width._self.errors.minValue_0',
      ),
      v.description('schemas.assets.room._props.width._self.description'),
    ),

    length: v.pipe(
      v.number('schemas.assets.room._props.length._self.errors.type'),
      v.minValue(
        0,
        'schemas.assets.room._props.length._self.errors.minValue_0',
      ),
      v.description('schemas.assets.room._props.length._self.description'),
    ),

    standing: v.optional(Standing),
  }),

  v.transform(room => ({
    ...room,
    area: room.width * room.length,
  })),
);

const RoomSchema = v.pipe(
  v.intersect([
    BaseRoomSchema,

    v.variant('kind', [
      v.object({
        kind: v.pipe(
          v.literal('bedroom'),
          v.description('schemas.assets.room._props.kind.description'),
        ),

        type: v.union([
          v.literal('principal'),
          v.literal('secondary'),
          v.literal('children'),
          v.literal('guest'),
        ]),

        closets: v.optional(
          v.pipe(
            v.number(
              'schemas.assets.room._props.closets._self.errors.type',
            ),
            v.minValue(
              0,
              'schemas.assets.room._props.closets._self.errors.minValue_0',
            ),
            v.description(
              'schemas.assets.room._props.closets._self.description',
            ),
          ),
          0,
        ),

        bathroom: v.optional(BaseRoomSchema),
      }),

      v.looseObject({
        kind: v.pipe(
          v.optional(
            v.union([
              v.literal('other'),
              v.literal('kitchen'),
              v.literal('bathroom'),
              v.literal('living room'),
              v.literal('dining room'),
              v.literal('office'),
              v.literal('garage'),
              v.literal('storage room'),
              v.literal('laundry room'),
              v.literal('balcony'),
              v.literal('terrace'),
              v.literal('garden'),
            ]),
          ),
        ),
      }),
    ]),
  ]),

  v.transform(room => ({
    ...room,
    area: room.width * room.length,
  })),

  v.description('schemas.assets.room.description'),
);

const Floor = v.pipe(
  v.object({
    rooms: v.pipe(
      v.array(
        RoomSchema,
        'schemas.assets.floor._props.rooms._self.errors.type',
      ),
      v.minLength(
        1,
        'schemas.assets.floor._props.rooms._self.errors.minLength_1',
      ),
      v.description('schemas.assets.floor._props.rooms._self.description'),
    ),

    level: v.pipe(
      v.number('schemas.assets.floor._props.level._self.error'),
      v.description('schemas.assets.floor._props.level._self.description'),
    ),

    description: v.optional(
      v.string('schemas.assets.floor._props.description._self.error'),
    ),
  }),
  v.description('schemas.assets.floor.description'),
);

export const AssetSchema = v.intersect([
  BaseAsset,

  v.variant('type', [
    v.object({
      type: v.pipe(
        v.optional(v.literal('field'), 'field'),
        v.description('schemas.assets.asset._props.type.field'),
      ),
    }),

    v.object({
      standing: Standing,

      type: v.pipe(
        v.literal('construction'),
        v.description('schemas.assets.asset._props.type.construction'),
      ),

      floors: v.pipe(
        v.array(
          Floor,
          'schemas.assets.asset._props.floors._self.errors.type',
        ),
        v.minLength(
          1,
          'schemas.assets.asset._props.floors._self.errors.minLength_1',
        ),
        v.description(
          'schemas.assets.asset._props.floors._self.description',
        ),
      ),
    }),
  ]),
]);

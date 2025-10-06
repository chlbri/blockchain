import { _ID, PhoneNumber, Social } from '#globals/back/schemas';
import * as v from 'valibot';

const IBAN_REGEX = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

const IntermediaryBase = v.object({
  id: _ID,
  walletID: v.pipe(
    v.string('schemas.intermediary._props.walletID._self.errors.type'),
    v.regex(
      IBAN_REGEX,
      'schemas.intermediary._props.walletID._self.errors.invalid',
    ),
  ),

  contacts: v.object({
    phoneNumbers: v.pipe(
      v.array(PhoneNumber),
      v.minLength(
        1,
        'schemas.intermediary._props.contacts._props.phoneNumbers._self.errors.minLength_1',
      ),
    ),

    emails: v.optional(
      v.pipe(
        v.array(
          v.object({
            url: v.pipe(
              v.string(
                'schemas.intermediary._props.contacts._props.emails._self.error',
              ),
              v.email(
                'schemas.intermediary._props.contacts._props.emails._self.errors.email',
              ),
            ),

            description: v.pipe(
              v.optional(
                v.string(
                  'schemas.intermediary._props.contacts._props.emails._self.error',
                ),
              ),
              v.description(
                'schemas.intermediary._props.contacts._props.emails._self.description',
              ),
            ),
          }),
        ),
        v.minLength(
          1,
          'schemas.intermediary._props.contacts._props.emails._self.errors.minLength_1',
        ),
      ),
    ),

    socials: v.optional(
      v.pipe(
        v.array(Social),
        v.minLength(
          1,
          'schemas.intermediary._props.contacts._props.socials._self.errors.minLength_1',
        ),
      ),
    ),

    websites: v.optional(
      v.pipe(
        v.array(
          v.object({
            url: v.pipe(
              v.string(
                'schemas.intermediary._props.contacts._props.websites._self.error',
              ),
              v.email(
                'schemas.intermediary._props.contacts._props.websites._self.errors.email',
              ),
            ),

            description: v.pipe(
              v.optional(
                v.string(
                  'schemas.intermediary._props.contacts._props.websites._self.error',
                ),
              ),
              v.description(
                'schemas.intermediary._props.contacts._props.websites._self.description',
              ),
            ),
          }),
        ),
        v.minLength(
          1,
          'schemas.intermediary._props.contacts._props.websites._self.errors.minLength_1',
        ),
      ),
    ),
  }),
});

export const Intermediary = v.pipe(
  v.intersect([
    IntermediaryBase,

    v.variant('personality', [
      v.object({
        personality: v.pipe(
          v.literal('individual'),
          v.description(
            'schemas.intermediary._props.personality.individual',
          ),
        ),

        firstName: v.pipe(
          v.string('schemas.intermediary._props.firstName._self.error'),
          v.description(
            'schemas.intermediary._props.firstName._self.description',
          ),
        ),

        lastName: v.pipe(
          v.string('schemas.intermediary._props.lastName._self.error'),
          v.description(
            'schemas.intermediary._props.lastName._self.description',
          ),
        ),

        nationalID: v.pipe(
          v.string('schemas.intermediary._props.nationalID._self.error'),
          v.minLength(
            3,
            'schemas.intermediary._props.nationalID._self.errors.minLength_3',
          ),
          v.description(
            'schemas.intermediary._props.nationalID._self.description',
          ),
        ),
      }),

      v.object({
        personality: v.pipe(
          v.literal('company'),
          v.description('schemas.intermediary._props.personality.company'),
        ),

        companyName: v.pipe(
          v.string('schemas.intermediary._props.companyName._self.error'),
          v.description(
            'schemas.intermediary._props.companyName._self.description',
          ),
        ),

        registrationID: v.pipe(
          v.string(
            'schemas.intermediary._props.registrationID._self.error',
          ),
          v.minLength(
            3,
            'schemas.intermediary._props.registrationID._self.errors.minLength_3',
          ),
          v.description(
            'schemas.intermediary._props.registrationID._self.description',
          ),
        ),
      }),
    ]),
  ]),

  v.transform(intermediary => ({
    ...intermediary,
    displayName:
      intermediary.personality === 'individual'
        ? `${intermediary.firstName} ${intermediary.lastName}`
        : intermediary.companyName,
  })),
);

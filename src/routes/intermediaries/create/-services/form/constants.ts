export const DEFAULT_INTERMEDIARY = {
  wallet: '',
  contacts: {
    phoneNumbers: [],
    emails: [],
    socials: [],
    websites: [],
  },
  personality: 'individual' as const,
  nationalID: '',
  firstName: '',
  lastName: '',
  companyName: '',
  registrationNumber: '',
  errors: {},
};

export const INTERMEDIARIES_STORAGE_KEY = 'intermediaries->';

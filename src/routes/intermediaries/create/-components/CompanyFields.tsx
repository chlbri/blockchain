interface CompanyFieldsProps {
  companyName: string;
  registrationNumber: string;
  onCompanyNameChange: (value: string) => void;
  onRegistrationNumberChange: (value: string) => void;
  errors: {
    companyName?: string;
    registrationNumber?: string;
  };
}

export const CompanyFields = (props: CompanyFieldsProps) => {
  return (
    <div class='space-y-4'>
      <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
        Informations de l'entreprise
      </h3>

      <div>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Nom de l'entreprise *
        </label>
        <input
          type='text'
          value={props.companyName}
          onInput={e => props.onCompanyNameChange(e.currentTarget.value)}
          placeholder='ABC Corporation'
          class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            props.errors.companyName
              ? 'border-red-500 focus:ring-red-500'
              : ''
          }`}
        />
        {props.errors.companyName && (
          <p class='mt-1 text-sm text-red-500'>
            {props.errors.companyName}
          </p>
        )}
      </div>

      <div>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Numéro d'enregistrement *
        </label>
        <input
          type='text'
          value={props.registrationNumber}
          onInput={e =>
            props.onRegistrationNumberChange(e.currentTarget.value)
          }
          placeholder='123456789'
          class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            props.errors.registrationNumber
              ? 'border-red-500 focus:ring-red-500'
              : ''
          }`}
        />
        {props.errors.registrationNumber && (
          <p class='mt-1 text-sm text-red-500'>
            {props.errors.registrationNumber}
          </p>
        )}
      </div>
    </div>
  );
};

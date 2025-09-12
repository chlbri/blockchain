interface IndividualFieldsProps {
  firstName: string;
  lastName: string;
  nationalID: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onNationalIdChange: (value: string) => void;
  errors: {
    firstName?: string;
    lastName?: string;
    nationalID?: string;
  };
}

export const IndividualFields = (props: IndividualFieldsProps) => {
  return (
    <div class='space-y-4'>
      <h3 class='text-lg font-medium text-gray-900 dark:text-white'>
        Informations personnelles
      </h3>

      <div class='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Prénom
          </label>
          <input
            type='text'
            value={props.firstName}
            onInput={e => props.onFirstNameChange(e.currentTarget.value)}
            placeholder='Jean'
            class='w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
        </div>

        <div>
          <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
            Nom de famille *
          </label>
          <input
            type='text'
            value={props.lastName}
            onInput={e => props.onLastNameChange(e.currentTarget.value)}
            placeholder='Dupont'
            class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              props.errors.lastName
                ? 'border-red-500 focus:ring-red-500'
                : ''
            }`}
          />
          {props.errors.lastName && (
            <p class='mt-1 text-sm text-red-500'>
              {props.errors.lastName}
            </p>
          )}
        </div>
      </div>

      <div>
        <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
          Numéro d'identité nationale *
        </label>
        <input
          type='text'
          value={props.nationalID}
          onInput={e => props.onNationalIdChange(e.currentTarget.value)}
          placeholder='1234567890123'
          class={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
            props.errors.nationalID
              ? 'border-red-500 focus:ring-red-500'
              : ''
          }`}
        />
        {props.errors.nationalID && (
          <p class='mt-1 text-sm text-red-500'>
            {props.errors.nationalID}
          </p>
        )}
      </div>
    </div>
  );
};

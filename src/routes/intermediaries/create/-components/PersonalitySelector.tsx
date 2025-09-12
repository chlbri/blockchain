interface PersonalitySelectorProps {
  value: 'individual' | 'company';
  onChange: (value: 'individual' | 'company') => void;
}

export const PersonalitySelector = (props: PersonalitySelectorProps) => {
  return (
    <div>
      <label class='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
        Type d'entité *
      </label>
      <div class='space-y-2'>
        <label class='flex items-center'>
          <input
            type='radio'
            value='individual'
            checked={props.value === 'individual'}
            onChange={() => props.onChange('individual')}
            class='mr-2'
          />
          Personne physique
        </label>
        <label class='flex items-center'>
          <input
            type='radio'
            value='company'
            checked={props.value === 'company'}
            onChange={() => props.onChange('company')}
            class='mr-2'
          />
          Entreprise
        </label>
      </div>
    </div>
  );
};

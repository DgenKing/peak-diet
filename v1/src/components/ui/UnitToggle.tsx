interface UnitToggleProps {
  options: [string, string];
  value: string;
  onChange: (value: string) => void;
}

export function UnitToggle({ options, value, onChange }: UnitToggleProps) {
  return (
    <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all
            ${value === opt
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

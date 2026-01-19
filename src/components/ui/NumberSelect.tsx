interface NumberSelectProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
  label?: string;
}

export function NumberSelect({ value, onChange, options, label }: NumberSelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`px-5 py-3 rounded-xl font-semibold transition-all min-w-[56px]
              ${value === opt
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

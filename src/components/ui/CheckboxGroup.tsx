interface Option {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  columns?: 1 | 2;
}

export function CheckboxGroup({ options, selected, onChange, columns = 1 }: CheckboxGroupProps) {
  const toggle = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  return (
    <div className={`grid gap-2 ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => toggle(opt.id)}
          className={`px-4 py-3 rounded-xl border-2 text-left transition-all text-sm
            ${selected.includes(opt.id)
              ? 'border-primary bg-primary-light dark:bg-primary/20 text-primary-dark dark:text-primary font-medium'
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
              ${selected.includes(opt.id) ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}
            >
              {selected.includes(opt.id) && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span>{opt.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

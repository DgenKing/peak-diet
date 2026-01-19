interface RadioCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: string;
  title: string;
  description?: string;
  disabled?: boolean;
}

export function RadioCard({ selected, onClick, icon, title, description, disabled }: RadioCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200
        ${selected
          ? 'border-primary bg-primary-light dark:bg-primary/20'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.99]'}
      `}
    >
      <div className="flex items-start gap-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <div className="flex-1">
          <div className={`font-semibold ${selected ? 'text-primary-dark dark:text-primary' : 'text-gray-900 dark:text-gray-100'}`}>
            {title}
          </div>
          {description && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</div>
          )}
        </div>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
          ${selected ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'}`}
        >
          {selected && (
            <div className="w-2 h-2 rounded-full bg-white" />
          )}
        </div>
      </div>
    </button>
  );
}

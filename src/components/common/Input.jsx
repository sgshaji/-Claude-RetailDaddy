export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  min,
  max,
  step,
  className = '',
  inputMode,
  error
}) {
  const inputId = `input-${label?.replace(/\s+/g, '-').toLowerCase()}`;

  // Determine inputMode based on type if not explicitly provided
  const finalInputMode = inputMode || (type === 'number' ? 'numeric' : 'text');

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        inputMode={finalInputMode}
        className={`h-14 px-4 text-lg rounded-lg border-2 transition-colors ${
          error
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
            : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}

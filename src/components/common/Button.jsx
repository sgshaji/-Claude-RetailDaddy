export function Button({
  children,
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) {
  const baseStyles = 'font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
    success: 'bg-green-500 text-white hover:bg-green-600 active:bg-green-700',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100'
  };

  const sizeStyles = {
    small: 'min-h-[40px] px-4 py-2 text-base',
    default: 'min-h-touch px-6 py-3 text-lg',
    large: 'min-h-touch-large px-8 py-4 text-xl font-bold'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
    >
      {children}
    </button>
  );
}

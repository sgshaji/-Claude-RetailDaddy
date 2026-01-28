export function Card({ children, className = '', onClick }) {
  const baseStyles = 'bg-white rounded-xl shadow-md p-4';
  const clickableStyles = onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : '';

  return (
    <div
      className={`${baseStyles} ${clickableStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

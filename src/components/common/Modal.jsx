import { useEffect } from 'react';

export function Modal({ isOpen, onClose, title, children, size = 'default' }) {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    small: 'max-h-[40vh]',
    default: 'max-h-[60vh]',
    large: 'max-h-[80vh]',
    full: 'h-[90vh]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Bottom Sheet */}
      <div
        className={`relative w-full bg-white rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out ${sizeClasses[size]} safe-area-pb`}
        style={{ animation: 'slideUp 0.3s ease-out' }}
      >
        {/* Drag Handle */}
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="px-6 py-3 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-6 py-4" style={{ maxHeight: 'calc(100% - 80px)' }}>
          {children}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    const toast = { id, message, type };

    setToasts(prev => [...prev, toast]);

    // Haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(type === 'success' ? 50 : [50, 50, 50]);
    }

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);

    return id;
  }, []);

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <div className="fixed top-20 left-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map(toast => (
          <Toast key={toast.id} {...toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function Toast({ message, type, onClose }) {
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div
      className={`${bgColors[type]} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 pointer-events-auto animate-slideDown`}
      onClick={onClose}
    >
      <span className="text-xl font-bold">{icons[type]}</span>
      <span className="flex-1 font-medium">{message}</span>
    </div>
  );
}

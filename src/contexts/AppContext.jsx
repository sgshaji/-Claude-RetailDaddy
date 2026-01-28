import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export function AppProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage
    const saved = localStorage.getItem('shopSettings');
    return saved ? JSON.parse(saved) : {
      currency: 'INR',
      currencySymbol: '₹',
      lowStockThreshold: 5,
      shopName: 'My Shop',
      notifications: true
    };
  });

  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('shopSettings', JSON.stringify(settings));
  }, [settings]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    settings,
    updateSettings,
    isOffline
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

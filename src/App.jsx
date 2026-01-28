import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './components/common/Toast';
import { Dashboard } from './screens/Dashboard';
import { QuickSale } from './screens/QuickSale';
import { Products } from './screens/Products';
import { Inventory } from './screens/Inventory';
import { Insights } from './screens/Insights';
import { useEffect } from 'react';
import { initializeDB } from './db/db';

function App() {
  useEffect(() => {
    // Initialize database with sample data on first load
    initializeDB();
  }, []);

  return (
    <Router>
      <AppProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quick-sale" element={<QuickSale />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AppProvider>
    </Router>
  );
}

export default App;

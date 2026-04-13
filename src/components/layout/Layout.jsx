import { BottomNav } from './BottomNav';

export function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}

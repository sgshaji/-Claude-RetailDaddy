import { BottomNav } from './BottomNav';
import { TopBar } from './TopBar';
import { useAppContext } from '../../contexts/AppContext';

export function Layout({ children, title }) {
  const { isOffline } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <TopBar title={title} />

      {isOffline && (
        <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
          📴 You're offline. Changes will sync when reconnected.
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-nav">
        <div className="max-w-mobile mx-auto">
          {children}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

import { useAppContext } from '../../contexts/AppContext';

export function TopBar({ title }) {
  const { settings } = useAppContext();

  return (
    <div className="bg-primary-500 text-white px-4 py-4 safe-area-pt shadow-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{title || settings.shopName}</h1>
        <div className="flex items-center gap-2">
          {/* Future: Add notifications bell, settings icon etc. */}
        </div>
      </div>
    </div>
  );
}

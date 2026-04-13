import { useAppContext } from '../../contexts/AppContext';

export function TopBar({ title }) {
  const { settings } = useAppContext();

  return (
    <div className="bg-primary-600 text-white px-5 pt-4 pb-3 safe-area-pt">
      <div className="flex items-center justify-between max-w-mobile mx-auto">
        <div>
          <p className="text-[10px] font-medium text-primary-200 uppercase tracking-wider">
            {settings.shopName}
          </p>
          <h1 className="text-lg font-bold -mt-0.5">{title || 'Dashboard'}</h1>
        </div>
      </div>
    </div>
  );
}

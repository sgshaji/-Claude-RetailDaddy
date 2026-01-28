import { Layout } from '../components/layout/Layout';
import { QuickStats } from '../components/dashboard/QuickStats';
import { TopProducts } from '../components/dashboard/TopProducts';
import { useDailySummary } from '../hooks/useDailySummary';
import { useProducts } from '../hooks/useProducts';
import { Card } from '../components/common/Card';
import { formatDate } from '../utils/dateHelpers';
import { getTodayDateString } from '../db/db';

export function Dashboard() {
  const { todaySummary, topProducts } = useDailySummary();
  const { lowStockProducts } = useProducts();

  return (
    <Layout title="Dashboard">
      <div className="pb-4">
        {/* Date Header */}
        <div className="px-4 py-3 bg-white border-b border-gray-200">
          <p className="text-sm text-gray-600">
            {formatDate(getTodayDateString())}
          </p>
        </div>

        {/* Quick Stats */}
        <QuickStats
          todaySummary={todaySummary}
          lowStockCount={lowStockProducts?.length || 0}
        />

        {/* Low Stock Alert */}
        {lowStockProducts && lowStockProducts.length > 0 && (
          <div className="px-4 mb-4">
            <Card className="bg-orange-50 border-2 border-orange-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-orange-800">
                    {lowStockProducts.length} item{lowStockProducts.length > 1 ? 's' : ''} low on stock
                  </p>
                  <p className="text-sm text-orange-600">
                    Check Inventory tab to restock
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Top Products */}
        <div className="px-4">
          <TopProducts products={topProducts} />
        </div>

        {/* Quick Action Prompt */}
        {!todaySummary || todaySummary.sales_count === 0 ? (
          <div className="px-4 mt-4">
            <Card className="bg-primary-50 border-2 border-primary-200 text-center p-6">
              <p className="text-3xl mb-2">🚀</p>
              <p className="font-bold text-primary-800 text-lg mb-1">
                Ready to start selling?
              </p>
              <p className="text-sm text-primary-600">
                Tap Quick Sale below to record your first sale today!
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

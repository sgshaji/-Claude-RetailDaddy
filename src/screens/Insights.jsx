import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { useDailySummary } from '../hooks/useDailySummary';
import { formatCurrency } from '../utils/currencyHelpers';
import { formatDate } from '../utils/dateHelpers';

export function Insights() {
  const { weekSummaries, topProducts } = useDailySummary();

  const weekTotal = weekSummaries?.reduce((acc, day) => ({
    sales: acc.sales + day.total_sales_amount,
    profit: acc.profit + day.total_profit,
    transactions: acc.transactions + day.sales_count
  }), { sales: 0, profit: 0, transactions: 0 });

  return (
    <Layout title="Insights">
      <div className="p-4 space-y-4">
        {/* Week Summary */}
        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Sales</p>
              <p className="text-xl font-bold text-primary-600">
                {formatCurrency(weekTotal?.sales || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Profit</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(weekTotal?.profit || 0)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Transactions</p>
              <p className="text-xl font-bold text-gray-900">
                {weekTotal?.transactions || 0}
              </p>
            </div>
          </div>
        </Card>

        {/* Daily Breakdown */}
        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Daily Breakdown</h2>
          <div className="space-y-2">
            {weekSummaries && weekSummaries.length > 0 ? (
              weekSummaries.slice().reverse().map(day => (
                <div
                  key={day.date}
                  className="flex items-center justify-between py-3 border-b last:border-b-0 border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatDate(day.date)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {day.sales_count} transaction{day.sales_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      {formatCurrency(day.total_sales_amount)}
                    </p>
                    <p className="text-sm text-green-600">
                      Profit: {formatCurrency(day.total_profit)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No sales data yet</p>
            )}
          </div>
        </Card>

        {/* Top Products */}
        <Card className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products (Last 7 Days)</h2>
          <div className="space-y-3">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div
                  key={product.product_id}
                  className="flex items-center gap-3 pb-3 border-b last:border-b-0 border-gray-200"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {product.product_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Sold: {product.total_quantity} units
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">
                      {formatCurrency(product.total_revenue)}
                    </p>
                    <p className="text-xs text-green-600">
                      +{formatCurrency(product.total_profit)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No sales data yet</p>
            )}
          </div>
        </Card>

        {/* Profit Margin Info */}
        {weekTotal && weekTotal.sales > 0 && (
          <Card className="p-4 bg-green-50 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profit Margin (7 days)</p>
                <p className="text-2xl font-bold text-green-600">
                  {((weekTotal.profit / weekTotal.sales) * 100).toFixed(1)}%
                </p>
              </div>
              <div className="text-5xl">💹</div>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}

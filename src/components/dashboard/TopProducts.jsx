import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/currencyHelpers';

export function TopProducts({ products = [] }) {
  if (!products || products.length === 0) {
    return (
      <Card className="p-6 text-center text-gray-500">
        <p>No sales data yet. Start selling to see top products!</p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.product_id}
            className="flex items-center gap-3 pb-3 border-b last:border-b-0 border-gray-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold text-sm">
              #{index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
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
              <p className="text-xs text-gray-500">
                Profit: {formatCurrency(product.total_profit)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

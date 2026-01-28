import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/currencyHelpers';

export function QuickStats({ todaySummary, lowStockCount }) {
  const stats = [
    {
      label: 'Today Sales',
      value: formatCurrency(todaySummary?.total_sales_amount || 0),
      icon: '💰',
      color: 'text-green-600'
    },
    {
      label: 'Today Profit',
      value: formatCurrency(todaySummary?.total_profit || 0),
      icon: '📈',
      color: 'text-blue-600'
    },
    {
      label: 'Transactions',
      value: todaySummary?.sales_count || 0,
      icon: '🧾',
      color: 'text-purple-600'
    },
    {
      label: 'Low Stock',
      value: lowStockCount || 0,
      icon: '⚠️',
      color: lowStockCount > 0 ? 'text-orange-600' : 'text-gray-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {stats.map((stat, index) => (
        <Card key={index} className="flex flex-col items-center justify-center p-4 min-h-[100px]">
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className={`text-2xl font-bold ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
        </Card>
      ))}
    </div>
  );
}

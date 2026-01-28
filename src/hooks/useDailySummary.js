import { useLiveQuery } from 'dexie-react-hooks';
import { db, getTodayDateString } from '../db/db';

export function useDailySummary() {
  const todaySummary = useLiveQuery(async () => {
    const today = getTodayDateString();
    const summary = await db.daily_summaries
      .where('date').equals(today)
      .first();

    return summary || {
      date: today,
      total_sales_amount: 0,
      total_profit: 0,
      sales_count: 0
    };
  }, []);

  const weekSummaries = useLiveQuery(async () => {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const summaries = await db.daily_summaries
      .where('date').aboveOrEqual(startDate)
      .toArray();

    return summaries.sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const monthSummaries = useLiveQuery(async () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = firstDayOfMonth.toISOString().split('T')[0];

    const summaries = await db.daily_summaries
      .where('date').aboveOrEqual(startDate)
      .toArray();

    return summaries.sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  const getTopProducts = useLiveQuery(async (period = 'week') => {
    const today = new Date();
    let startDate;

    if (period === 'week') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      startDate = sevenDaysAgo.toISOString();
    } else if (period === 'month') {
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      startDate = firstDayOfMonth.toISOString();
    } else {
      // Default to all time
      const allTime = new Date(0);
      startDate = allTime.toISOString();
    }

    const sales = await db.sales
      .where('status').equals('completed')
      .and(s => new Date(s.date) >= new Date(startDate))
      .toArray();

    // Group by product
    const productStats = {};
    sales.forEach(sale => {
      if (!productStats[sale.product_id]) {
        productStats[sale.product_id] = {
          product_id: sale.product_id,
          product_name: sale.product_name,
          total_quantity: 0,
          total_revenue: 0,
          total_profit: 0,
          sales_count: 0
        };
      }

      productStats[sale.product_id].total_quantity += sale.quantity;
      productStats[sale.product_id].total_revenue += sale.total_amount;
      productStats[sale.product_id].total_profit += sale.profit;
      productStats[sale.product_id].sales_count += 1;
    });

    // Convert to array and sort by revenue
    const topProducts = Object.values(productStats)
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, 5);

    return topProducts;
  }, []);

  const getSummaryByDateRange = async (startDate, endDate) => {
    try {
      const summaries = await db.daily_summaries
        .where('date')
        .between(startDate, endDate, true, true)
        .toArray();

      const totals = summaries.reduce((acc, summary) => ({
        total_sales_amount: acc.total_sales_amount + summary.total_sales_amount,
        total_profit: acc.total_profit + summary.total_profit,
        sales_count: acc.sales_count + summary.sales_count
      }), {
        total_sales_amount: 0,
        total_profit: 0,
        sales_count: 0
      });

      return {
        summaries,
        totals
      };
    } catch (error) {
      console.error('Error fetching summary by date range:', error);
      throw error;
    }
  };

  return {
    todaySummary,
    weekSummaries,
    monthSummaries,
    topProducts: getTopProducts,
    getSummaryByDateRange
  };
}

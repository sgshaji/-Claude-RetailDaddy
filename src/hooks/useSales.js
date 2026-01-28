import { useLiveQuery } from 'dexie-react-hooks';
import { db, getTodayDateString } from '../db/db';

export function useSales(dateFilter = null) {
  const sales = useLiveQuery(async () => {
    let query = db.sales.where('status').equals('completed');

    if (dateFilter) {
      // Filter by specific date
      const startOfDay = new Date(dateFilter);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateFilter);
      endOfDay.setHours(23, 59, 59, 999);

      query = query.and(s => {
        const saleDate = new Date(s.date);
        return saleDate >= startOfDay && saleDate <= endOfDay;
      });
    }

    const results = await query.toArray();
    return results.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [dateFilter]);

  const createSale = async (saleData) => {
    try {
      // Start a transaction to ensure data integrity
      return await db.transaction('rw', db.products, db.sales, db.inventory_transactions, db.daily_summaries, async () => {
        // Get product details
        const product = await db.products.get(saleData.product_id);
        if (!product) {
          throw new Error('Product not found');
        }

        // Check stock availability
        if (product.current_stock < saleData.quantity) {
          throw new Error(`Insufficient stock. Available: ${product.current_stock}`);
        }

        // Calculate totals
        const unit_price = saleData.unit_price || product.selling_price;
        const unit_cost = product.cost_price;
        const total_amount = unit_price * saleData.quantity;
        const profit = total_amount - (unit_cost * saleData.quantity);

        // Create sale record
        const sale = {
          product_id: product.uuid,
          product_name: product.name,
          quantity: saleData.quantity,
          unit_price,
          unit_cost,
          total_amount,
          profit,
          date: saleData.date || new Date().toISOString(),
          payment_method: saleData.payment_method || 'cash',
          customer_name: saleData.customer_name || '',
          notes: saleData.notes || '',
          status: 'completed'
        };

        const saleId = await db.sales.add(sale);

        // Update product stock
        const new_stock = product.current_stock - saleData.quantity;
        await db.products.update(product.id, {
          current_stock: new_stock
        });

        // Create inventory transaction
        await db.inventory_transactions.add({
          product_id: product.uuid,
          product_name: product.name,
          transaction_type: 'sale',
          quantity: -saleData.quantity,
          previous_stock: product.current_stock,
          new_stock,
          unit_cost,
          reference_id: sale.uuid,
          date: sale.date
        });

        // Update daily summary
        await updateDailySummary(sale.date, total_amount, profit);

        return saleId;
      });
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  };

  const getTodaySales = useLiveQuery(async () => {
    const today = getTodayDateString();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const sales = await db.sales
      .where('status').equals('completed')
      .and(s => {
        const saleDate = new Date(s.date);
        return saleDate >= startOfDay && saleDate <= endOfDay;
      })
      .toArray();

    return sales;
  }, []);

  const getRecentSales = useLiveQuery(async () => {
    const sales = await db.sales
      .where('status').equals('completed')
      .reverse()
      .limit(10)
      .toArray();

    return sales;
  }, []);

  const deleteSale = async (saleId) => {
    try {
      await db.transaction('rw', db.sales, db.products, db.inventory_transactions, db.daily_summaries, async () => {
        const sale = await db.sales.get(saleId);
        if (!sale) {
          throw new Error('Sale not found');
        }

        // Restore stock
        const product = await db.products.where('uuid').equals(sale.product_id).first();
        if (product) {
          await db.products.update(product.id, {
            current_stock: product.current_stock + sale.quantity
          });

          // Create reversal inventory transaction
          await db.inventory_transactions.add({
            product_id: product.uuid,
            product_name: product.name,
            transaction_type: 'return',
            quantity: sale.quantity,
            previous_stock: product.current_stock,
            new_stock: product.current_stock + sale.quantity,
            reference_id: sale.uuid,
            reason: 'Sale cancelled',
            date: new Date().toISOString()
          });
        }

        // Update daily summary
        await updateDailySummary(sale.date, -sale.total_amount, -sale.profit);

        // Soft delete the sale
        await db.sales.update(saleId, {
          status: 'cancelled',
          deleted_at: new Date().toISOString()
        });
      });
    } catch (error) {
      console.error('Error deleting sale:', error);
      throw error;
    }
  };

  return {
    sales,
    todaySales: getTodaySales,
    recentSales: getRecentSales,
    createSale,
    deleteSale
  };
}

// Helper function to update daily summary
async function updateDailySummary(saleDate, amountDelta, profitDelta) {
  const dateString = saleDate.split('T')[0];

  const existingSummary = await db.daily_summaries
    .where('date').equals(dateString)
    .first();

  if (existingSummary) {
    await db.daily_summaries.update(existingSummary.id, {
      total_sales_amount: existingSummary.total_sales_amount + amountDelta,
      total_profit: existingSummary.total_profit + profitDelta,
      sales_count: existingSummary.sales_count + (amountDelta > 0 ? 1 : -1)
    });
  } else if (amountDelta > 0) {
    await db.daily_summaries.add({
      date: dateString,
      total_sales_amount: amountDelta,
      total_profit: profitDelta,
      sales_count: 1
    });
  }
}

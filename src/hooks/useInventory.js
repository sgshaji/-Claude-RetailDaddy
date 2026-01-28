import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useInventory() {
  const transactions = useLiveQuery(async () => {
    const txns = await db.inventory_transactions
      .orderBy('date')
      .reverse()
      .limit(100)
      .toArray();

    return txns;
  }, []);

  const addStockIn = async (productId, quantity, unitCost, reason = '') => {
    try {
      return await db.transaction('rw', db.products, db.inventory_transactions, async () => {
        const product = await db.products.get(productId);
        if (!product) {
          throw new Error('Product not found');
        }

        const new_stock = product.current_stock + quantity;

        await db.products.update(productId, {
          current_stock: new_stock
        });

        await db.inventory_transactions.add({
          product_id: product.uuid,
          product_name: product.name,
          transaction_type: 'stock_in',
          quantity,
          previous_stock: product.current_stock,
          new_stock,
          unit_cost: unitCost || product.cost_price,
          reason,
          date: new Date().toISOString()
        });

        return new_stock;
      });
    } catch (error) {
      console.error('Error adding stock:', error);
      throw error;
    }
  };

  const addStockOut = async (productId, quantity, reason = '') => {
    try {
      return await db.transaction('rw', db.products, db.inventory_transactions, async () => {
        const product = await db.products.get(productId);
        if (!product) {
          throw new Error('Product not found');
        }

        if (product.current_stock < quantity) {
          throw new Error(`Insufficient stock. Available: ${product.current_stock}`);
        }

        const new_stock = product.current_stock - quantity;

        await db.products.update(productId, {
          current_stock: new_stock
        });

        await db.inventory_transactions.add({
          product_id: product.uuid,
          product_name: product.name,
          transaction_type: 'stock_out',
          quantity: -quantity,
          previous_stock: product.current_stock,
          new_stock,
          reason,
          date: new Date().toISOString()
        });

        return new_stock;
      });
    } catch (error) {
      console.error('Error removing stock:', error);
      throw error;
    }
  };

  const adjustStock = async (productId, newQuantity, reason = '') => {
    try {
      return await db.transaction('rw', db.products, db.inventory_transactions, async () => {
        const product = await db.products.get(productId);
        if (!product) {
          throw new Error('Product not found');
        }

        const difference = newQuantity - product.current_stock;

        await db.products.update(productId, {
          current_stock: newQuantity
        });

        await db.inventory_transactions.add({
          product_id: product.uuid,
          product_name: product.name,
          transaction_type: 'adjustment',
          quantity: difference,
          previous_stock: product.current_stock,
          new_stock: newQuantity,
          reason,
          date: new Date().toISOString()
        });

        return newQuantity;
      });
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  };

  const getProductTransactions = async (productId) => {
    try {
      const product = await db.products.get(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      return await db.inventory_transactions
        .where('product_id').equals(product.uuid)
        .reverse()
        .toArray();
    } catch (error) {
      console.error('Error fetching product transactions:', error);
      throw error;
    }
  };

  return {
    transactions,
    addStockIn,
    addStockOut,
    adjustStock,
    getProductTransactions
  };
}

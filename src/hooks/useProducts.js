import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

export function useProducts(filter = {}) {
  const products = useLiveQuery(async () => {
    let query = db.products.where('status').equals('active');

    if (filter.category && filter.category !== 'All') {
      query = query.and(p => p.category === filter.category);
    }

    if (filter.lowStock) {
      query = query.and(p => p.current_stock <= p.low_stock_threshold);
    }

    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      query = query.and(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.barcode && p.barcode.toLowerCase().includes(searchLower))
      );
    }

    const results = await query.toArray();
    return results.sort((a, b) => a.name.localeCompare(b.name));
  }, [filter.category, filter.lowStock, filter.search]);

  const addProduct = async (product) => {
    try {
      const id = await db.products.add(product);
      return id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, changes) => {
    try {
      await db.products.update(id, changes);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      // Soft delete
      await db.products.update(id, {
        status: 'inactive',
        deleted_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const getProductById = async (id) => {
    try {
      return await db.products.get(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  const getProductByUuid = async (uuid) => {
    try {
      return await db.products.where('uuid').equals(uuid).first();
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  };

  const getLowStockProducts = useLiveQuery(async () => {
    const products = await db.products
      .where('status').equals('active')
      .toArray();

    return products.filter(p => p.current_stock <= p.low_stock_threshold);
  }, []);

  const getCategories = useLiveQuery(async () => {
    const products = await db.products
      .where('status').equals('active')
      .toArray();

    const categories = [...new Set(products.map(p => p.category))];
    return categories.sort();
  }, []);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductByUuid,
    lowStockProducts: getLowStockProducts,
    categories: getCategories
  };
}

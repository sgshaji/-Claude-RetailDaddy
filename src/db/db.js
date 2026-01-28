import Dexie from 'dexie';
import { SCHEMA_VERSION, STORES, DEFAULTS } from './schema';

// Create database instance
export const db = new Dexie('RetailShopDB');

// Define schema
db.version(SCHEMA_VERSION).stores(STORES);

// Hooks for automatic timestamp and UUID management
db.products.hook('creating', (primKey, obj) => {
  if (!obj.uuid) obj.uuid = crypto.randomUUID();
  obj.created_at = new Date().toISOString();
  obj.updated_at = new Date().toISOString();
  obj.sync_status = obj.sync_status || DEFAULTS.products.sync_status;
  obj.sync_version = DEFAULTS.products.sync_version;
  obj.status = obj.status || DEFAULTS.products.status;
});

db.products.hook('updating', (mods, primKey, obj) => {
  mods.updated_at = new Date().toISOString();
  if (!mods.deleted_at) {
    mods.sync_status = 'dirty';
    mods.sync_version = (obj.sync_version || 0) + 1;
  }
});

db.sales.hook('creating', (primKey, obj) => {
  if (!obj.uuid) obj.uuid = crypto.randomUUID();
  obj.created_at = new Date().toISOString();
  obj.updated_at = new Date().toISOString();
  obj.date = obj.date || new Date().toISOString();
  obj.sync_status = obj.sync_status || DEFAULTS.sales.sync_status;
  obj.sync_version = DEFAULTS.sales.sync_version;
  obj.status = obj.status || DEFAULTS.sales.status;
  obj.payment_method = obj.payment_method || DEFAULTS.sales.payment_method;
});

db.sales.hook('updating', (mods, primKey, obj) => {
  mods.updated_at = new Date().toISOString();
  if (!mods.deleted_at) {
    mods.sync_status = 'dirty';
    mods.sync_version = (obj.sync_version || 0) + 1;
  }
});

db.inventory_transactions.hook('creating', (primKey, obj) => {
  if (!obj.uuid) obj.uuid = crypto.randomUUID();
  obj.created_at = new Date().toISOString();
  obj.updated_at = new Date().toISOString();
  obj.date = obj.date || new Date().toISOString();
  obj.sync_status = obj.sync_status || DEFAULTS.inventory_transactions.sync_status;
  obj.sync_version = DEFAULTS.inventory_transactions.sync_version;
});

db.inventory_transactions.hook('updating', (mods, primKey, obj) => {
  mods.updated_at = new Date().toISOString();
});

db.daily_summaries.hook('creating', (primKey, obj) => {
  obj.created_at = new Date().toISOString();
  obj.updated_at = new Date().toISOString();
});

db.daily_summaries.hook('updating', (mods, primKey, obj) => {
  mods.updated_at = new Date().toISOString();
});

// Initialize default data if needed
export async function initializeDB() {
  try {
    const productCount = await db.products.count();
    if (productCount === 0) {
      // Add sample products for first-time users
      await db.products.bulkAdd([
        {
          name: 'Sample Product 1',
          description: 'This is a sample product',
          cost_price: 50,
          selling_price: 100,
          current_stock: 20,
          low_stock_threshold: 5,
          unit: 'pieces',
          category: 'General',
          status: 'active'
        },
        {
          name: 'Sample Product 2',
          description: 'Another sample product',
          cost_price: 30,
          selling_price: 60,
          current_stock: 15,
          low_stock_threshold: 5,
          unit: 'pieces',
          category: 'General',
          status: 'active'
        },
        {
          name: 'Sample Product 3',
          description: 'Third sample product',
          cost_price: 100,
          selling_price: 180,
          current_stock: 8,
          low_stock_threshold: 5,
          unit: 'pieces',
          category: 'Premium',
          status: 'active'
        }
      ]);
      console.log('Sample products added');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Get today's date in YYYY-MM-DD format
export function getTodayDateString() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Export db instance as default
export default db;

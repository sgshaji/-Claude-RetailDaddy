// Dexie schema definition with sync-ready structure
export const SCHEMA_VERSION = 1;

export const STORES = {
  // Products catalog
  products: '++id, uuid, name, barcode, category, status, created_at, updated_at',

  // Sales transactions
  sales: '++id, uuid, date, product_id, status, created_at',

  // Inventory movements
  inventory_transactions: '++id, uuid, product_id, transaction_type, date, created_at',

  // Daily aggregated summaries
  daily_summaries: '++id, date',

  // Sync metadata for future cloud sync
  sync_meta: '++id, entity_type, last_sync_at'
};

// Field descriptions and default values
export const DEFAULTS = {
  products: {
    status: 'active',
    sync_status: 'local',
    sync_version: 1,
    current_stock: 0,
    low_stock_threshold: 5,
    unit: 'pieces',
    category: 'General'
  },
  sales: {
    status: 'completed',
    sync_status: 'local',
    sync_version: 1,
    payment_method: 'cash'
  },
  inventory_transactions: {
    sync_status: 'local',
    sync_version: 1
  }
};

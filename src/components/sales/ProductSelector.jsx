import { useState } from 'react';
import { Card } from '../common/Card';
import { formatCurrency } from '../../utils/currencyHelpers';

export function ProductSelector({ products = [], onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 bg-white border-b border-gray-200 sticky top-0 z-10">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          className="w-full h-12 px-4 text-base rounded-lg border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
          autoFocus
        />
      </div>

      {/* Product Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              onClick={() => onSelect(product)}
              className={`p-3 cursor-pointer active:scale-95 transition-transform ${
                product.current_stock <= 0
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              <div className="text-center">
                <p className="font-bold text-gray-900 text-sm mb-1 truncate">
                  {product.name}
                </p>
                <p className="text-lg font-bold text-primary-600 mb-1">
                  {formatCurrency(product.selling_price)}
                </p>
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-xs ${
                    product.current_stock <= product.low_stock_threshold
                      ? 'text-orange-600 font-bold'
                      : 'text-gray-500'
                  }`}>
                    Stock: {product.current_stock}
                  </span>
                </div>
                {product.current_stock <= 0 && (
                  <p className="text-xs text-red-600 font-bold mt-1">Out of Stock</p>
                )}
              </div>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="text-4xl mb-2">🔍</p>
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  );
}

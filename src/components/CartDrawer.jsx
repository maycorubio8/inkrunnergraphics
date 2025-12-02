'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CartDrawer() {
  const { 
    items, 
    itemCount, 
    subtotal, 
    isDrawerOpen, 
    closeDrawer, 
    removeItem 
  } = useCart();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert('Error: ' + error);
        setIsCheckingOut(false);
        return;
      }

      // Redirigir a Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    
    if (isDrawerOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isDrawerOpen, closeDrawer]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={closeDrawer}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Your Cart ({itemCount})
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <button
                onClick={closeDrawer}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeItem} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            
            <p className="text-sm text-gray-500 text-center">
              Shipping & taxes calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="block w-full py-3 px-4 bg-black text-white text-center rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isCheckingOut ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Checkout — ${subtotal.toFixed(2)}`
                )}
              </button>
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="block w-full py-3 px-4 border border-gray-300 text-gray-700 text-center rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Cart Item Component
function CartItem({ item, onRemove }) {
  const sizeDisplay = item.customSize 
    ? `${item.customSize.width}" × ${item.customSize.height}"`
    : item.size?.name;

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
      {/* Design Preview */}
      <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-gray-200">
        {item.designFile?.url || item.designFile?.localPreview ? (
          <img
            src={item.designFile.url || item.designFile.localPreview}
            alt="Design"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">
            🖼️
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">
          {item.productName || 'Custom Stickers'}
        </h3>
        <div className="text-sm text-gray-500 mt-1 space-y-0.5">
          <p>{item.shape?.name} • {item.material?.name}</p>
          <p>{sizeDisplay} • Qty: {item.quantity.toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold text-gray-900">
            ${item.price?.total?.toFixed(2)}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-500 hover:text-red-700 hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
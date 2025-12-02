'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { items, itemCount, subtotal, removeItem, clearCart, isLoaded } = useCart();
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

      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Something went wrong. Please try again.');
      setIsCheckingOut(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some custom stickers to get started!</p>
          <Link
            href="/products/vinyl-stickers"
            className="inline-flex px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Start Creating
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard key={item.id} item={item} onRemove={removeItem} />
            ))}

            {/* Clear Cart */}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear your cart?')) {
                  clearCart();
                }
              }}
              className="text-sm text-red-500 hover:text-red-700 hover:underline"
            >
              Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-500">Calculated at checkout</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="block w-full py-3.5 px-4 bg-black text-white text-center rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                  'Proceed to Checkout'
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                🔒 Secure checkout powered by Stripe
              </p>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-green-500">✓</span>
                  <span>Free Online Proof</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-orange-500">⏱</span>
                  <span>Printed in 24-48 hours</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-500">📦</span>
                  <span>Free Shipping, always</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartItemCard({ item, onRemove }) {
  const sizeDisplay = item.customSize 
    ? `${item.customSize.width}" × ${item.customSize.height}"`
    : item.size?.name;

  return (
    <div className="flex gap-6 p-6 bg-white border border-gray-200 rounded-2xl">
      {/* Design Preview */}
      <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
        {item.designFile?.url || item.designFile?.localPreview ? (
          <img
            src={item.designFile.url || item.designFile.localPreview}
            alt="Design"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl">
            🖼️
          </div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {item.productName || 'Custom Stickers'}
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              {item.designFile?.originalName}
            </p>
          </div>
          <p className="text-xl font-bold text-gray-900">
            ${item.price?.total?.toFixed(2)}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Shape</p>
            <p className="font-medium text-gray-900 text-sm">{item.shape?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Material</p>
            <p className="font-medium text-gray-900 text-sm">{item.material?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Size</p>
            <p className="font-medium text-gray-900 text-sm">{sizeDisplay}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">Quantity</p>
            <p className="font-medium text-gray-900 text-sm">{item.quantity?.toLocaleString()}</p>
          </div>
        </div>

        {/* Instructions */}
        {item.instructions && (
          <p className="text-sm text-gray-500 mt-3 italic">
            "{item.instructions}"
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            ${item.price?.unit?.toFixed(2)}/ea
            {item.price?.discount > 0 && (
              <span className="text-green-600 ml-2">({item.price.discount}% off)</span>
            )}
          </p>
          <button
            onClick={() => onRemove(item.id)}
            className="text-sm text-red-500 hover:text-red-700 hover:underline ml-auto"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
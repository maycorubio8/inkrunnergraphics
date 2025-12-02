'use client'

import { useState, useMemo } from 'react'

const shapes = [
  { id: 'custom', name: 'Custom Shape', icon: '🚀', popular: true },
  { id: 'kiss-cut', name: 'Kiss-Cut', icon: '📄', popular: false },
  { id: 'circle', name: 'Circle', icon: '⚪', popular: false },
  { id: 'oval', name: 'Oval', icon: '🥚', popular: false },
  { id: 'square', name: 'Square', icon: '⬜', popular: false },
  { id: 'rectangle', name: 'Rectangle', icon: '📱', popular: false },
]

const materials = [
  { id: 'matte', name: 'Matte', icon: '📝', popular: true, multiplier: 1.0 },
  { id: 'gloss', name: 'Gloss', icon: '✨', popular: false, multiplier: 1.1 },
  { id: 'holographic', name: 'Holographic', icon: '🌈', popular: false, multiplier: 1.5 },
  { id: 'clear', name: 'Clear', icon: '💎', popular: false, multiplier: 1.3 },
]

const sizes = [
  { id: 'small', name: 'Small', size: '2"', icon: '🔹', popular: false, basePrice: 0.45 },
  { id: 'medium', name: 'Medium', size: '3"', icon: '🔷', popular: true, basePrice: 0.65 },
  { id: 'large', name: 'Large', size: '4"', icon: '💠', popular: false, basePrice: 0.95 },
  { id: 'xlarge', name: 'X-Large', size: '5"', icon: '📀', popular: false, basePrice: 1.35 },
  { id: 'custom', name: 'Custom size', icon: '📐', popular: false, basePrice: null },
]

const quantities = [50, 100, 200, 300, 500, 1000, 2500]

const getDiscount = (qty) => {
  if (qty >= 2500) return 0.50
  if (qty >= 1000) return 0.45
  if (qty >= 500) return 0.40
  if (qty >= 300) return 0.35
  if (qty >= 200) return 0.30
  if (qty >= 100) return 0.25
  if (qty >= 50) return 0.15
  return 0
}

export default function ProductConfigurator({ productType }) {
  const [config, setConfig] = useState({
    shape: 'custom',
    material: 'matte',
    size: 'medium',
    quantity: 100,
    customWidth: 3,
    customHeight: 3,
  })

  const pricing = useMemo(() => {
    const material = materials.find(m => m.id === config.material)
    const size = sizes.find(s => s.id === config.size)
    const discount = getDiscount(config.quantity)

    let basePrice
    if (config.size === 'custom') {
      basePrice = config.customWidth * config.customHeight * 0.10
    } else {
      basePrice = size?.basePrice || 0.65
    }

    const unitPrice = basePrice * (material?.multiplier || 1)
    const discountedPrice = unitPrice * (1 - discount)
    const total = discountedPrice * config.quantity

    return { unitPrice, discountedPrice, discount, total }
  }, [config])

  const getQuantityPrice = (qty) => {
    const material = materials.find(m => m.id === config.material)
    const size = sizes.find(s => s.id === config.size)
    const discount = getDiscount(qty)

    let basePrice
    if (config.size === 'custom') {
      basePrice = config.customWidth * config.customHeight * 0.10
    } else {
      basePrice = size?.basePrice || 0.65
    }

    const unitPrice = basePrice * (material?.multiplier || 1)
    return unitPrice * (1 - discount) * qty
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Column 1: Shape */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
          <span>🚀</span> Select a Shape
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {shapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setConfig(c => ({ ...c, shape: shape.id }))}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                config.shape === shape.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {shape.popular && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              <div className="text-3xl mb-2">{shape.icon}</div>
              <div className="text-gray-900 text-sm font-medium">{shape.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: Material */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
          <span>📄</span> Material
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setConfig(c => ({ ...c, material: mat.id }))}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                config.material === mat.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {mat.popular && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              <div className="text-3xl mb-2">{mat.icon}</div>
              <div className="text-gray-900 text-sm font-medium">{mat.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Column 3: Size */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
          <span>📏</span> Select a size
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => setConfig(c => ({ ...c, size: size.id }))}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                config.size === size.id
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {size.popular && (
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
              <div className="text-2xl mb-2">{size.icon}</div>
              <div className="text-gray-900 text-sm font-medium">{size.name}</div>
              {size.size && <div className="text-gray-500 text-xs">({size.size})</div>}
            </button>
          ))}
        </div>

        {config.size === 'custom' && (
          <div className="mt-4 flex gap-3">
            <div className="flex-1">
              <label className="text-gray-500 text-xs">Width"</label>
              <input
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={config.customWidth}
                onChange={e => setConfig(c => ({ ...c, customWidth: parseFloat(e.target.value) || 1 }))}
                className="w-full mt-1 p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-gray-900 focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-gray-500 text-xs">Height"</label>
              <input
                type="number"
                min="1"
                max="12"
                step="0.5"
                value={config.customHeight}
                onChange={e => setConfig(c => ({ ...c, customHeight: parseFloat(e.target.value) || 1 }))}
                className="w-full mt-1 p-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:border-gray-900 focus:outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Column 4: Quantity & Price */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="flex items-center gap-2 text-gray-900 font-semibold mb-4">
          <span>#</span> Select a quantity
        </h3>
        <div className="space-y-2">
          {quantities.map((qty) => {
            const price = getQuantityPrice(qty)
            const discount = getDiscount(qty)
            const isSelected = config.quantity === qty
            
            return (
              <button
                key={qty}
                onClick={() => setConfig(c => ({ ...c, quantity: qty }))}
                className={`w-full p-3 rounded-xl border-2 transition-all flex justify-between items-center ${
                  isSelected
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <span className="text-gray-900 font-medium">{qty.toLocaleString()}</span>
                <div className="text-right">
                  <span className="text-gray-900 font-semibold">${price.toFixed(2)}</span>
                  {discount > 0 && (
                    <span className="ml-2 text-green-600 text-sm font-medium">
                      Save {(discount * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Total */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-end mb-4">
            <span className="text-gray-500">Total:</span>
            <div className="text-right">
              <span className="text-3xl font-bold text-gray-900">
                ${pricing.total.toFixed(2)}
              </span>
              <div className="text-gray-500 text-sm">
                ${pricing.discountedPrice.toFixed(2)}/ea
              </div>
            </div>
          </div>

          <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-xl transition-all">
            Upload Your Design →
          </button>
          
          <p className="text-center text-gray-500 text-xs mt-3">
            Free proof included • Free shipping
          </p>
        </div>
      </div>
    </div>
  )
}
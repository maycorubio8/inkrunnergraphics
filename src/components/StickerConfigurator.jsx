'use client'

import { useState, useMemo, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// Fallback config mientras carga de Supabase
const DEFAULT_CONFIG = {
  materials: [
    { id: 'matte', name: 'Matte Vinyl', price_multiplier: 1.0 },
    { id: 'glossy', name: 'Glossy Vinyl', price_multiplier: 1.1 },
  ],
  sizes: [
    { id: '3x3', name: '3" x 3"', base_price: 0.65 },
  ],
  finishes: [
    { id: 'none', name: 'Standard', price_add: 0 },
  ],
  quantityBreaks: [
    { min_qty: 25, max_qty: 1000, discount_percent: 0 },
  ],
}

export default function StickerConfigurator() {
  const [pricingConfig, setPricingConfig] = useState(DEFAULT_CONFIG)
  const [loading, setLoading] = useState(true)
  
  const [config, setConfig] = useState({
    material: 'matte',
    size: '3x3',
    customWidth: 3,
    customHeight: 3,
    quantity: 50,
    finish: 'none',
  })

  // Cargar configuración de Supabase
  useEffect(() => {
    async function loadPricing() {
      try {
        const [
          { data: materials },
          { data: sizes },
          { data: finishes },
          { data: quantityBreaks }
        ] = await Promise.all([
          supabase.from('materials').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('sizes').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('finishes').select('*').eq('is_active', true).order('sort_order'),
          supabase.from('quantity_breaks').select('*').eq('is_active', true).order('min_qty'),
        ])

        setPricingConfig({
          materials: materials || DEFAULT_CONFIG.materials,
          sizes: sizes || DEFAULT_CONFIG.sizes,
          finishes: finishes || DEFAULT_CONFIG.finishes,
          quantityBreaks: quantityBreaks || DEFAULT_CONFIG.quantityBreaks,
        })

        // Set initial values based on loaded data
        if (materials?.length) setConfig(c => ({ ...c, material: materials[0].id }))
        if (sizes?.length) setConfig(c => ({ ...c, size: sizes[0].id }))
        if (finishes?.length) setConfig(c => ({ ...c, finish: finishes[0].id }))
      } catch (err) {
        console.error('Error loading pricing:', err)
      } finally {
        setLoading(false)
      }
    }
    loadPricing()
  }, [])

  const pricing = useMemo(() => {
    const { materials, sizes, finishes, quantityBreaks } = pricingConfig
    
    const material = materials.find(m => m.id === config.material) || materials[0]
    const size = sizes.find(s => s.id === config.size) || sizes[0]
    const finish = finishes.find(f => f.id === config.finish) || finishes[0]
    const qtyBreak = quantityBreaks.find(
      q => config.quantity >= q.min_qty && (q.max_qty === null || config.quantity <= q.max_qty)
    ) || quantityBreaks[0]

    // Calcular precio base por unidad
    let basePrice
    if (config.size === 'custom') {
      const sqInches = config.customWidth * config.customHeight
      const customSize = sizes.find(s => s.id === 'custom')
      basePrice = sqInches * (customSize?.base_price || 0.12)
    } else {
      basePrice = parseFloat(size.base_price)
    }

    // Aplicar multiplicadores
    const multiplier = parseFloat(material.price_multiplier) || 1
    const finishAdd = parseFloat(finish.price_add) || 0
    const discount = parseFloat(qtyBreak?.discount_percent || 0) / 100

    const unitPrice = (basePrice * multiplier) + finishAdd
    const discountedPrice = unitPrice * (1 - discount)
    const subtotal = discountedPrice * config.quantity

    return {
      unitPrice: unitPrice.toFixed(2),
      discountedPrice: discountedPrice.toFixed(2),
      discount: discount,
      subtotal: subtotal.toFixed(2),
    }
  }, [config, pricingConfig])

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading pricing...</div>
      </div>
    )
  }

  const { materials, sizes, finishes, quantityBreaks } = pricingConfig

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Get Your Price
          </h2>
          <p className="text-purple-300">Configure your stickers below</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Configurator Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">1. Choose Options</h3>
            
            {/* Material */}
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-3">Material</label>
              <div className="grid grid-cols-2 gap-2">
                {materials.map(mat => (
                  <button
                    key={mat.id}
                    onClick={() => updateConfig('material', mat.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      config.material === mat.id
                        ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                        : 'bg-white/10 text-purple-100 hover:bg-white/20'
                    }`}
                  >
                    {mat.name}
                    {mat.price_multiplier > 1 && (
                      <span className="block text-xs opacity-70">
                        +{((mat.price_multiplier - 1) * 100).toFixed(0)}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-3">Size</label>
              <div className="grid grid-cols-3 gap-2">
                {sizes.map(s => (
                  <button
                    key={s.id}
                    onClick={() => updateConfig('size', s.id)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      config.size === s.id
                        ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                        : 'bg-white/10 text-purple-100 hover:bg-white/20'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              
              {config.size === 'custom' && (
                <div className="mt-4 flex gap-4">
                  <div className="flex-1">
                    <label className="text-purple-300 text-xs">Width (inches)</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      step="0.5"
                      value={config.customWidth}
                      onChange={e => updateConfig('customWidth', parseFloat(e.target.value) || 1)}
                      className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-purple-300 text-xs">Height (inches)</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      step="0.5"
                      value={config.customHeight}
                      onChange={e => updateConfig('customHeight', parseFloat(e.target.value) || 1)}
                      className="w-full mt-1 p-2 rounded-lg bg-white/10 border border-white/20 text-white"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Finish */}
            <div className="mb-6">
              <label className="block text-purple-200 text-sm font-medium mb-3">Finish</label>
              <div className="space-y-2">
                {finishes.map(f => (
                  <button
                    key={f.id}
                    onClick={() => updateConfig('finish', f.id)}
                    className={`w-full p-3 rounded-lg text-sm font-medium transition-all text-left flex justify-between ${
                      config.finish === f.id
                        ? 'bg-purple-500 text-white ring-2 ring-purple-300'
                        : 'bg-white/10 text-purple-100 hover:bg-white/20'
                    }`}
                  >
                    <span>{f.name}</span>
                    {f.price_add > 0 && <span className="opacity-70">+${f.price_add}/ea</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-3">
                Quantity: <span className="text-white font-bold">{config.quantity}</span>
              </label>
              <input
                type="range"
                min="25"
                max="1000"
                step="25"
                value={config.quantity}
                onChange={e => updateConfig('quantity', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-xs text-purple-300 mt-1">
                <span>25</span>
                <span>250</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>
          </div>

          {/* Pricing Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-6">2. Your Price</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <div className="text-purple-200 text-sm mb-2">Selected:</div>
                <div className="text-white">
                  <span className="font-medium">{materials.find(m => m.id === config.material)?.name}</span>
                  {' • '}
                  <span>{config.size === 'custom' 
                    ? `${config.customWidth}" x ${config.customHeight}"`
                    : sizes.find(s => s.id === config.size)?.name}</span>
                  {' • '}
                  <span>{config.quantity} units</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-purple-200">
                  <span>Base price per sticker</span>
                  <span>${pricing.unitPrice}</span>
                </div>
                
                {pricing.discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Volume discount ({(pricing.discount * 100).toFixed(0)}% off)</span>
                    <span>-${((pricing.unitPrice - pricing.discountedPrice) * config.quantity).toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-purple-200">
                  <span>Price per sticker</span>
                  <span className="font-medium">${pricing.discountedPrice}</span>
                </div>
                
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Total</span>
                    <span>${pricing.subtotal}</span>
                  </div>
                  <div className="text-purple-300 text-sm text-right">Free shipping</div>
                </div>
              </div>

              <div className="bg-purple-500/20 rounded-xl p-4 mt-6">
                <div className="text-purple-200 text-sm font-medium mb-2">💡 Volume Discounts</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {quantityBreaks.slice(0, 4).map(q => (
                    <div 
                      key={q.min_qty}
                      className={`flex justify-between ${
                        config.quantity >= q.min_qty && (q.max_qty === null || config.quantity <= q.max_qty)
                          ? 'text-green-400 font-medium'
                          : 'text-purple-300'
                      }`}
                    >
                      <span>{q.min_qty}+</span>
                      <span>{q.discount_percent > 0 ? `${q.discount_percent}% off` : 'Base'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                Upload Your Design →
              </button>
              
              <p className="text-center text-purple-300 text-xs">
                Free proof included • No setup fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client';

import { useState, useEffect } from 'react';
import FileUploader from './FileUploader';
import { useCart } from '@/context/CartContext';

// Datos temporales (después conectaremos a Supabase)
const SHAPES = [
  { id: 'die-cut', name: 'Custom Shape', description: 'Cut to your design shape', icon: '✂️', popular: true },
  { id: 'kiss-cut', name: 'Kiss-Cut', description: 'Easy peel backing', icon: '🚀' },
  { id: 'circle', name: 'Circle', description: 'Perfect round shape', icon: '🔵' },
  { id: 'oval', name: 'Oval', description: 'Elegant oval shape', icon: '🥚' },
  { id: 'square', name: 'Square', description: 'Classic square shape', icon: '🟪' },
  { id: 'rectangle', name: 'Rectangle', description: 'Rectangular shape', icon: '🌈' },
];

const MATERIALS = [
  { id: 'matte', name: 'Matte', multiplier: 1.0, description: 'No-glare finish', icon: '📄', popular: true },
  { id: 'gloss', name: 'Gloss', multiplier: 1.1, description: 'Shiny finish', icon: '✨' },
  { id: 'holographic', name: 'Holographic', multiplier: 1.5, description: 'Rainbow shimmer', icon: '🌈' },
  { id: 'clear', name: 'Clear', multiplier: 1.2, description: 'Transparent vinyl', icon: '💎' },
];

const SIZES = [
  { id: '2inch', name: 'Small (2")', basePrice: 1.35, icon: '🏷️', inches: 2 },
  { id: '3inch', name: 'Medium (3")', basePrice: 1.75, icon: '📮', popular: true, inches: 3 },
  { id: '4inch', name: 'Large (4")', basePrice: 2.20, icon: '🍞', inches: 4 },
  { id: '5inch', name: 'X-Large (5")', basePrice: 2.80, icon: '💿', inches: 5 },
  { id: 'custom', name: 'Custom Size', basePrice: 0, icon: '📐', isCustom: true },
];

const QUANTITY_OPTIONS = [
  { qty: 50, discount: 0 },
  { qty: 100, discount: 35 },
  { qty: 200, discount: 54 },
  { qty: 300, discount: 61 },
  { qty: 500, discount: 68 },
  { qty: 1000, discount: 74 },
  { qty: 2500, discount: 81 },
];

export default function ProductConfigurator({ product }) {
  const { addItem } = useCart();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    shape: SHAPES[0],
    material: MATERIALS[0],
    size: SIZES[1],
    quantity: 1000,
    customQuantity: '',
    instructions: '',
    designFile: null,
  });

  const [price, setPrice] = useState({ unit: 0, total: 0, discount: 0 });
  const [customSize, setCustomSize] = useState({ width: '', height: '' });

  // Calcular precio para custom size basado en área
  const calculateCustomPrice = (width, height) => {
    if (!width || !height) return 1.75; // default
    const area = parseFloat(width) * parseFloat(height);
    // Precio base por pulgada cuadrada
    const pricePerSqInch = 0.20;
    return Math.max(1.35, area * pricePerSqInch);
  };

  // Calcular precio
  useEffect(() => {
    let basePrice = config.size.basePrice;
    
    // Si es custom size, calcular basado en dimensiones
    if (config.size.isCustom) {
      basePrice = calculateCustomPrice(customSize.width, customSize.height);
    }
    
    const materialMultiplier = config.material.multiplier;
    const unitPriceBase = basePrice * materialMultiplier;

    const qtyOption = QUANTITY_OPTIONS.find(q => q.qty === config.quantity);
    const discountPercent = qtyOption?.discount || 0;

    // Precio sin descuento
    const fullPrice = unitPriceBase * config.quantity;
    // Precio con descuento
    const discountedTotal = fullPrice * (1 - discountPercent / 100);
    const unitPrice = discountedTotal / config.quantity;

    setPrice({
      unit: unitPrice,
      total: discountedTotal,
      discount: discountPercent,
      savings: fullPrice - discountedTotal,
      fullPrice: fullPrice,
    });
  }, [config, customSize]);

  const handleFileUploaded = (fileData) => {
    setConfig((prev) => ({ ...prev, designFile: fileData }));
  };

  const handleFileRemoved = () => {
    setConfig((prev) => ({ ...prev, designFile: null }));
  };

  const canProceed = () => {
    if (step === 2) return config.designFile !== null;
    return true;
  };

  const steps = ['Customize', 'Upload Artwork', 'Review'];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      {/* Progress Steps */}
      <div className="flex border-b border-gray-100">
        {steps.map((label, i) => (
          <button
            key={i}
            onClick={() => i + 1 <= step && setStep(i + 1)}
            className={`flex-1 py-4 px-4 text-sm font-medium transition-colors relative
              ${step === i + 1 
                ? 'text-gray-900 bg-gray-50' 
                : step > i + 1
                  ? 'text-green-600 hover:bg-green-50 cursor-pointer'
                  : 'text-gray-400 cursor-default'
              }`}
          >
            <span className={`
              inline-flex items-center justify-center w-6 h-6 rounded-full mr-2 text-xs font-bold
              ${step === i + 1 
                ? 'bg-black text-white' 
                : step > i + 1
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }
            `}>
              {step > i + 1 ? '✓' : i + 1}
            </span>
            {label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* Step 1: Customize Options */}
        {step === 1 && (
          <div className="space-y-8">
            {/* Shape Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>✂️</span> Select a Shape
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {SHAPES.map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => setConfig((prev) => ({ ...prev, shape }))}
                    className={`relative p-4 rounded-xl border-2 transition-all text-center
                      ${config.shape.id === shape.id
                        ? 'border-black bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {shape.popular && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    <div className="text-2xl mb-2">{shape.icon}</div>
                    <p className="font-medium text-gray-900 text-sm">{shape.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📄</span> Material
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {MATERIALS.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setConfig((prev) => ({ ...prev, material }))}
                    className={`relative p-4 rounded-xl border-2 transition-all text-center
                      ${config.material.id === material.id
                        ? 'border-black bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {material.popular && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    <div className="text-2xl mb-2">{material.icon}</div>
                    <p className="font-medium text-gray-900 text-sm">{material.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📐</span> Select a Size
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setConfig((prev) => ({ ...prev, size }))}
                    className={`relative p-4 rounded-xl border-2 transition-all text-center
                      ${config.size.id === size.id
                        ? 'border-black bg-gray-50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {size.popular && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                        Popular
                      </span>
                    )}
                    <div className="text-2xl mb-2">{size.icon}</div>
                    <p className="font-medium text-gray-900 text-sm">{size.name}</p>
                  </button>
                ))}
              </div>
              
              {/* Custom Size Inputs */}
              {config.size.isCustom && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Enter your custom dimensions:</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Width (inches)</label>
                      <input
                        type="number"
                        min="0.5"
                        max="20"
                        step="0.25"
                        placeholder="Width"
                        value={customSize.width}
                        onChange={(e) => setCustomSize(prev => ({ ...prev, width: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                      />
                    </div>
                    <span className="text-gray-400 mt-5">×</span>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 mb-1 block">Height (inches)</label>
                      <input
                        type="number"
                        min="0.5"
                        max="20"
                        step="0.25"
                        placeholder="Height"
                        value={customSize.height}
                        onChange={(e) => setCustomSize(prev => ({ ...prev, height: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                      />
                    </div>
                    <div className="mt-5 text-sm text-gray-500">in</div>
                  </div>
                  {customSize.width && customSize.height && (
                    <p className="text-sm text-gray-600 mt-3">
                      Area: {(parseFloat(customSize.width) * parseFloat(customSize.height)).toFixed(2)} sq in 
                      <span className="text-gray-400 ml-2">
                        (Est. ${calculateCustomPrice(customSize.width, customSize.height).toFixed(2)}/ea base)
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Quantity Selection */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>#</span> Select a Quantity
              </h4>
              <div className="space-y-2">
                {QUANTITY_OPTIONS.map((option) => {
                  // Usar precio custom si está seleccionado, sino el precio normal
                  const basePrice = config.size.isCustom 
                    ? calculateCustomPrice(customSize.width, customSize.height)
                    : config.size.basePrice;
                  const baseTotal = basePrice * config.material.multiplier * option.qty;
                  const discountedTotal = baseTotal * (1 - option.discount / 100);
                  
                  return (
                    <button
                      key={option.qty}
                      onClick={() => setConfig((prev) => ({ ...prev, quantity: option.qty }))}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                        ${config.quantity === option.qty
                          ? 'border-black bg-gray-50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                      <span className="font-semibold text-gray-900">
                        {option.qty.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-900">
                          ${discountedTotal.toFixed(2)}
                        </span>
                        {option.discount > 0 && (
                          <span className="text-green-600 text-sm font-medium">
                            Save {option.discount}%
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
                
                {/* Custom Quantity */}
                <div className={`p-4 rounded-xl border-2 transition-all
                  ${config.customQuantity ? 'border-black bg-gray-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Custom</span>
                    <input
                      type="number"
                      placeholder="Enter quantity"
                      value={config.customQuantity}
                      onChange={(e) => {
                        const val = e.target.value;
                        setConfig((prev) => ({ 
                          ...prev, 
                          customQuantity: val,
                          quantity: parseInt(val) || prev.quantity
                        }));
                      }}
                      className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Upload Design */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Instructions */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>📝</span> Additional Instructions (optional)
              </h4>
              <textarea
                value={config.instructions}
                onChange={(e) => setConfig((prev) => ({ ...prev, instructions: e.target.value }))}
                placeholder="Enter any special requests or instructions here..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-black outline-none resize-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span>☁️</span> Upload Your Design
              </h4>
              <FileUploader
                onFileUploaded={handleFileUploaded}
                onFileRemoved={handleFileRemoved}
                maxFiles={1}
              />
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
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
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Review Your Order</h3>
              <p className="text-gray-500 text-sm">Confirm your sticker specifications</p>
            </div>

            {/* Design Preview */}
            {config.designFile && (
              <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                {(config.designFile.localPreview || config.designFile.url) && (
                  <img
                    src={config.designFile.localPreview || config.designFile.url}
                    alt="Design preview"
                    className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{config.designFile.originalName}</p>
                  <p className="text-sm text-gray-500">Design uploaded ✓</p>
                  {config.instructions && (
                    <p className="text-sm text-gray-600 mt-2 italic">"{config.instructions}"</p>
                  )}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-1">Shape</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span>{config.shape.icon}</span> {config.shape.name}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-1">Material</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span>{config.material.icon}</span> {config.material.name}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-1">Size</p>
                <p className="font-medium text-gray-900 flex items-center gap-2">
                  <span>{config.size.icon}</span> 
                  {config.size.isCustom 
                    ? `${customSize.width}" × ${customSize.height}"`
                    : config.size.name
                  }
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-500 mb-1">Quantity</p>
                <p className="font-medium text-gray-900">{config.quantity.toLocaleString()} stickers</p>
              </div>
            </div>
          </div>
        )}

        {/* Pricing & Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          {/* Price Display */}
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-sm text-gray-500">Price per sticker</p>
              <p className="text-gray-900 font-medium">${price.unit.toFixed(2)}/ea</p>
            </div>
            <div className="text-right">
              {price.discount > 0 && (
                <p className="text-sm text-green-600 mb-1 font-medium">
                  Save {price.discount}%
                </p>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-400">Total:</span>
                <p className="text-3xl font-bold text-gray-900">
                  ${price.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex-1 py-3.5 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className={`flex-1 py-3.5 px-6 rounded-xl font-medium transition-colors
                  ${canProceed()
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                {step === 2 && !config.designFile 
                  ? 'Upload Artwork to Continue' 
                  : 'Continue'
                }
              </button>
            ) : (
              <button
                onClick={() => {
                  // Agregar al carrito
                  addItem({
                    productName: product?.name || 'Custom Stickers',
                    productSlug: product?.slug,
                    shape: config.shape,
                    material: config.material,
                    size: config.size,
                    customSize: config.size.isCustom ? customSize : null,
                    quantity: config.quantity,
                    instructions: config.instructions,
                    designFile: config.designFile,
                    price: price,
                  });
                  
                  // Reset form
                  setStep(1);
                  setConfig({
                    shape: SHAPES[0],
                    material: MATERIALS[0],
                    size: SIZES[1],
                    quantity: 1000,
                    customQuantity: '',
                    instructions: '',
                    designFile: null,
                  });
                  setCustomSize({ width: '', height: '' });
                }}
                className="flex-1 py-3.5 px-6 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
              >
                Add to Cart — ${price.total.toFixed(2)}
              </button>
            )}
          </div>

          {step === 2 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Items will be added to your cart for review before checkout
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
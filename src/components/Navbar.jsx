'use client'

import { useState } from 'react'
import Link from 'next/link'

const products = [
  { name: 'Vinyl Stickers', href: '/products/vinyl-stickers', icon: '🎨' },
  { name: 'Holographic Stickers', href: '/products/holographic-stickers', icon: '✨' },
  { name: 'Clear Stickers', href: '/products/clear-stickers', icon: '💎' },
  { name: 'Product Labels', href: '/products/labels', icon: '🏷️' },
  { name: 'Vinyl Banners', href: '/products/banners', icon: '🖼️' },
  { name: 'Custom Magnets', href: '/products/magnets', icon: '🧲' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProductsOpen, setIsProductsOpen] = useState(false)

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🖨️</span>
            <span className="text-xl font-bold text-gray-900">InkRunner</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                onBlur={() => setTimeout(() => setIsProductsOpen(false), 200)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Products
                <svg className={`w-4 h-4 transition-transform ${isProductsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProductsOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-2">
                  {products.map((product) => (
                    <Link
                      key={product.href}
                      href={product.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xl">{product.icon}</span>
                      <span className="text-gray-900">{product.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/products/vinyl-stickers"
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-5 py-2 rounded-full transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-900 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <div className="text-gray-400 text-sm px-2 mb-2">Products</div>
              {products.map((product) => (
                <Link
                  key={product.href}
                  href={product.href}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{product.icon}</span>
                  <span className="text-gray-900">{product.name}</span>
                </Link>
              ))}
              <div className="border-t border-gray-200 mt-4 pt-4">
                <Link href="/about" className="block px-2 py-2 text-gray-600">About</Link>
                <Link href="/contact" className="block px-2 py-2 text-gray-600">Contact</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
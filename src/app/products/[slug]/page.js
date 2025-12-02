import Footer from '@/components/Footer'
import ProductConfigurator from '@/components/ProductConfigurator'
import Link from 'next/link'

const productData = {
  'vinyl-stickers': {
    name: 'Vinyl Stickers',
    description: 'Perfect for any application. The perfect sticker.',
    longDescription: 'Premium vinyl stickers perfect for laptops, water bottles, and outdoor use - waterproof, scratch-resistant, and dishwasher safe.',
    icon: '🎨',
  },
  'holographic-stickers': {
    name: 'Holographic Stickers',
    description: 'Rainbow prismatic effect that catches the eye.',
    longDescription: 'Eye-catching holographic stickers with a stunning rainbow effect. Perfect for special editions and premium products.',
    icon: '✨',
  },
  'clear-stickers': {
    name: 'Clear Stickers',
    description: 'Transparent background for a seamless look.',
    longDescription: 'Crystal clear stickers that blend seamlessly with any surface. Great for windows, packaging, and glass.',
    icon: '💎',
  },
  'labels': {
    name: 'Product Labels',
    description: 'Professional labels for your products.',
    longDescription: 'High-quality labels perfect for bottles, jars, and product packaging. Waterproof and oil-resistant options available.',
    icon: '🏷️',
  },
  'banners': {
    name: 'Vinyl Banners',
    description: 'Large format printing for events and signage.',
    longDescription: 'Durable vinyl banners for indoor and outdoor use. Perfect for events, storefronts, and trade shows.',
    icon: '🖼️',
  },
  'magnets': {
    name: 'Custom Magnets',
    description: 'Flexible magnetic material.',
    longDescription: 'High-quality flexible magnets perfect for cars, fridges, and promotional giveaways.',
    icon: '🧲',
  },
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = productData[slug] || productData['vinyl-stickers']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link 
          href="/#products" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Products
        </Link>
      </div>

      {/* Product Hero */}
      <section className="max-w-7xl mx-auto px-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 border border-gray-200">
          <div className="flex items-center gap-6">
            <span className="text-6xl">{product.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {product.longDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Configurator */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <ProductConfigurator productType={slug} />
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-2xl mb-3">🛡️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Weather Resistant</h3>
            <p className="text-gray-500 text-sm">Our vinyl stickers are waterproof and UV-resistant, lasting 3-5 years outdoors.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-2xl mb-3">🎨</div>
            <h3 className="font-semibold text-gray-900 mb-2">Vibrant Colors</h3>
            <p className="text-gray-500 text-sm">High-resolution printing with vivid, fade-resistant inks for stunning results.</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-2xl mb-3">✂️</div>
            <h3 className="font-semibold text-gray-900 mb-2">Custom Cut</h3>
            <p className="text-gray-500 text-sm">Precision die-cut to any shape. Your design, perfectly trimmed.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
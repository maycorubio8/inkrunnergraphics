import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const products = [
  {
    id: 'vinyl-stickers',
    name: 'Vinyl Stickers',
    description: 'Weatherproof & durable',
    image: '🎨',
    href: '/products/vinyl-stickers',
    badge: 'Popular',
  },
  {
    id: 'holographic-stickers',
    name: 'Holographic Stickers',
    description: 'Rainbow prismatic effect',
    image: '✨',
    href: '/products/holographic-stickers',
    badge: null,
  },
  {
    id: 'clear-stickers',
    name: 'Clear Stickers',
    description: 'Transparent background',
    image: '💎',
    href: '/products/clear-stickers',
    badge: null,
  },
  {
    id: 'labels',
    name: 'Product Labels',
    description: 'For packaging & bottles',
    image: '🏷️',
    href: '/products/labels',
    badge: 'New',
  },
  {
    id: 'banners',
    name: 'Vinyl Banners',
    description: 'Large format printing',
    image: '🖼️',
    href: '/products/banners',
    badge: null,
  },
  {
    id: 'magnets',
    name: 'Custom Magnets',
    description: 'Flexible magnetic material',
    image: '🧲',
    href: '/products/magnets',
    badge: null,
  },
]

const benefits = [
  { icon: '📦', title: 'Free Shipping', desc: 'on all orders' },
  { icon: '🇺🇸', title: 'Made in USA', desc: 'premium quality' },
  { icon: '✅', title: 'Free Proof', desc: 'with every order' },
  { icon: '⚡', title: 'Fast Turnaround', desc: '3-5 business days' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-green-100 rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-purple-100 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-sm text-gray-600">Trusted by <span className="font-semibold text-gray-900">2,000+</span> businesses</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Premium Custom Printing
              <span className="block text-gray-400">
                Made Simple.
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              High-quality stickers, labels, and banners for your brand. 
              Free shipping on every order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="#products"
                className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all"
              >
                Get Started
              </Link>
              <Link 
                href="#how-it-works"
                className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-semibold py-4 px-8 rounded-full border border-gray-300 transition-all"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl -z-10"></div>
      </section>

      {/* Benefits Bar */}
      <section className="border-y border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                <span className="text-2xl">{benefit.icon}</span>
                <div>
                  <div className="text-gray-900 font-semibold text-sm">{benefit.title}</div>
                  <div className="text-gray-500 text-xs">{benefit.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Products
            </h2>
            <p className="text-gray-500 text-lg">
              Choose your product type to get started
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={product.href}
                className="group relative bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
              >
                {product.badge && (
                  <span className="absolute top-4 right-4 bg-gray-900 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {product.badge}
                  </span>
                )}
                
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {product.image}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  {product.name}
                  <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </h3>
                <p className="text-gray-500 text-sm">{product.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-4">
            <span className="inline-block text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
              HOW IT WORKS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
            Simple Process
          </h2>
          <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
            From design to delivery in just a few easy steps
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Choose Product', desc: 'Select your product type and customize options' },
              { step: '2', title: 'Upload Design', desc: 'Upload your artwork in any common format' },
              { step: '3', title: 'Approve Proof', desc: 'Review your free digital proof within 24hrs' },
              { step: '4', title: 'Receive Order', desc: 'Get your order in 3-5 business days' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-gray-900 font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-4">
            <span className="inline-block text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full mb-4">
              TESTIMONIALS
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">
            Don't Take
          </h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-400 text-center mb-12">
            Our Word for It
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah M.', role: 'Small Business Owner', text: 'The quality exceeded my expectations. My product labels look so professional now!' },
              { name: 'Mike R.', role: 'Event Planner', text: 'Fast turnaround and the colors were spot-on. Will definitely order again.' },
              { name: 'Lisa K.', role: 'Artist', text: 'Finally found a reliable sticker printer. The holographic finish is stunning!' },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-500 text-lg mb-8">
            Get a free quote in seconds. No account required.
          </p>
          <Link 
            href="/products/vinyl-stickers"
            className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-8 rounded-full transition-all"
          >
            Start Your Order →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
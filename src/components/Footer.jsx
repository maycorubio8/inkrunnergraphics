import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🖨️</span>
              <span className="text-xl font-bold text-gray-900">InkRunner</span>
            </Link>
            <p className="text-gray-500 text-sm">
              Premium custom printing made simple. Quality you can trust.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Products</h4>
            <ul className="space-y-2">
              <li><Link href="/products/vinyl-stickers" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Vinyl Stickers</Link></li>
              <li><Link href="/products/holographic-stickers" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Holographic Stickers</Link></li>
              <li><Link href="/products/clear-stickers" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Clear Stickers</Link></li>
              <li><Link href="/products/labels" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Labels</Link></li>
              <li><Link href="/products/banners" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Banners</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/shipping" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Shipping Info</Link></li>
              <li><Link href="/artwork" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Artwork Guidelines</Link></li>
              <li><a href="mailto:hello@inkrunner.com" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">hello@inkrunner.com</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2024 InkRunner Graphics. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-gray-400 hover:text-gray-900 text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
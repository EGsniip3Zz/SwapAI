import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">SwapAI</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link to="/marketplace" className="text-slate-400 hover:text-white transition-colors text-sm">Marketplace</Link>
            <Link to="/sell" className="text-slate-400 hover:text-white transition-colors text-sm">Sell</Link>
            <Link to="/for-buyers" className="text-slate-400 hover:text-white transition-colors text-sm">For Buyers</Link>
            <Link to="/blog" className="text-slate-400 hover:text-white transition-colors text-sm">Blog</Link>
            <Link to="/support" className="text-slate-400 hover:text-white transition-colors text-sm">Support</Link>
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</Link>
          </div>

          {/* Social + Copyright */}
          <div className="flex items-center gap-4">
            <a href="https://x.com/SwapAi_Shop" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.instagram.com/swapaishop" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <span className="text-slate-600">|</span>
            <p className="text-slate-500 text-sm">
              © 2025 SwapAI
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

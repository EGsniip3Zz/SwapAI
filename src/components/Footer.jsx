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
          <div className="flex items-center gap-6">
            <Link to="/marketplace" className="text-slate-400 hover:text-white transition-colors text-sm">Marketplace</Link>
            <Link to="/sell" className="text-slate-400 hover:text-white transition-colors text-sm">Sell</Link>
            <Link to="/support" className="text-slate-400 hover:text-white transition-colors text-sm">Support</Link>
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors text-sm">About</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">Terms</Link>
          </div>

          {/* Copyright */}
          <p className="text-slate-500 text-sm">
            © 2025 SwapAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Signup from './pages/Signup'
import Marketplace from './pages/Marketplace'
import ListingDetail from './pages/ListingDetail'
import SellTool from './pages/SellTool'
import Admin from './pages/Admin'
import Support from './pages/Support'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Messages from './pages/Messages'
import EditListing from './pages/EditListing'
import FAQ from './pages/FAQ'
import Blog from './pages/Blog'
import ForBuyers from './pages/ForBuyers'
import SellerProfile from './pages/SellerProfile'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/buy" element={<Navigate to="/marketplace" replace />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/sell" element={<SellTool />} />
          <Route path="/edit-listing/:id" element={<EditListing />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/support" element={<Support />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/for-buyers" element={<ForBuyers />} />
          <Route path="/seller/:id" element={<SellerProfile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

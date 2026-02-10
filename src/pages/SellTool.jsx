import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import {
  Upload, Plus, X, AlertCircle, CheckCircle,
  Image as ImageIcon, DollarSign, Tag, FileText, Link as LinkIcon, Zap
} from 'lucide-react'

const categories = [
  { value: 'text-nlp', label: 'Text & NLP', emoji: '📝' },
  { value: 'image-gen', label: 'Image Gen', emoji: '🎨' },
  { value: 'voice-audio', label: 'Voice & Audio', emoji: '🎙️' },
  { value: 'video', label: 'Video', emoji: '🎬' },
  { value: 'data-analysis', label: 'Data Analysis', emoji: '📊' },
  { value: 'automation', label: 'Automation', emoji: '⚡' },
  { value: 'other', label: 'Other', emoji: '🤖' },
]

const priceTypes = [
  { value: 'one-time', label: 'One-time Purchase' },
  { value: 'monthly', label: 'Monthly Subscription' },
  { value: 'free', label: 'Free' },
  { value: 'contact', label: 'Contact for Pricing' },
]

export default function SellTool() {
  const { user, isSeller } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    short_description: '',
    description: '',
    category: 'text-nlp',
    emoji: '🤖',
    price_type: 'one-time',
    price: '',
    website_url: '',
    demo_url: '',
    docs_url: '',
    features: [''],
    tech_stack: [''],
  })

  if (!user || !isSeller) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-4">Seller Access Required</h1>
          <p className="text-slate-400 mb-6">You need to be registered as a seller to list tools.</p>
          <button onClick={() => navigate('/signup')} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-semibold">Sign Up as Seller</button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20">
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Listing Submitted!</h1>
          <p className="text-slate-400 mb-6">Your tool is now live on the marketplace.</p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/marketplace')} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-semibold">View Marketplace</button>
            <button onClick={() => { setSuccess(false); setImageFile(null); setImagePreview(null); setFormData({ title: '', short_description: '', description: '', category: 'text-nlp', emoji: '🤖', price_type: 'one-time', price: '', website_url: '', demo_url: '', docs_url: '', features: [''], tech_stack: [] }); }} className="px-6 py-3 bg-slate-800 rounded-lg text-white font-medium">List Another Tool</button>
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))
  }

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return }
      if (!file.type.startsWith('image/')) { setError('Please select an image file'); return }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return null
    setUploading(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = user.id + '-' + Date.now() + '.' + fileExt
      const filePath = 'listings/' + fileName
      const { error: uploadError } = await supabase.storage.from('listing-images').upload(filePath, imageFile)
      if (uploadError) throw uploadError
      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => { setImageFile(null); setImagePreview(null) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!formData.title.trim()) throw new Error('Title is required')
      if (!formData.short_description.trim()) throw new Error('Short description is required')
      if (!formData.description.trim()) throw new Error('Full description is required')
      if (formData.price_type !== 'free' && formData.price_type !== 'contact' && !formData.price) throw new Error('Price is required')

      const features = formData.features.filter(f => f.trim())
      const tech_stack = formData.tech_stack.filter(t => t.trim())

      let imageUrl = null
      if (imageFile) { imageUrl = await uploadImage() }

      const { error } = await supabase.from('listings').insert({
        seller_id: user.id,
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        description: formData.description.trim(),
        category: formData.category,
        emoji: formData.emoji,
        price_type: formData.price_type,
        price: formData.price_type === 'free' || formData.price_type === 'contact' ? 0 : Math.round(parseFloat(formData.price)),
        website_url: formData.website_url.trim() || null,
        demo_url: formData.demo_url.trim() || null,
        docs_url: formData.docs_url.trim() || null,
        features: features.length > 0 ? features : null,
        tech_stack: tech_stack.length > 0 ? tech_stack : null,
        image_url: imageUrl,
        status: 'approved',
        rating: 5.0,
        review_count: 0,
        purchase_count: 0,
      })
      if (error) throw error
      setSuccess(true)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">List Your AI Tool</h1>
          <p className="text-slate-400">Fill out the form below to list your tool on the marketplace</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tool Name *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required maxLength={100} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="e.g., TextGenius AI" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                    {categories.map(cat => (<option key={cat.value} value={cat.value}>{cat.emoji} {cat.label}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Emoji</label>
                  <input type="text" name="emoji" value={formData.emoji} onChange={handleChange} maxLength={2} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-2xl text-center focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="🤖" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Short Description *</label>
                <input type="text" name="short_description" value={formData.short_description} onChange={handleChange} required maxLength={200} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="A brief one-liner about your tool" />
                <p className="mt-1 text-xs text-slate-500">{formData.short_description.length}/200 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={6} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" placeholder="Describe what your tool does..." />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-violet-400" />
              Product Image
            </h2>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 text-slate-500 mb-3" />
                  <p className="mb-2 text-sm text-slate-400"><span className="font-semibold text-violet-400">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-slate-500">PNG, JPG, WEBP (MAX 5MB)</p>
                </div>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            )}
            <p className="mt-2 text-xs text-slate-500">Recommended: 16:9 aspect ratio, at least 1280x720px</p>
          </div>

          {/* Pricing */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-violet-400" />
              Pricing
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Pricing Type *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {priceTypes.map(type => (
                    <button key={type.value} type="button" onClick={() => setFormData(prev => ({ ...prev, price_type: type.value }))} className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${formData.price_type === type.value ? 'bg-violet-500/20 border-violet-500 text-white border' : 'bg-slate-800 border-slate-700 text-slate-400 border hover:border-slate-600'}`}>{type.label}</button>
                  ))}
                </div>
              </div>
              {(formData.price_type === 'one-time' || formData.price_type === 'monthly') && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price (USD) {formData.price_type === 'monthly' && '/ month'} *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="0.00" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-violet-400" />
              Links
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Website URL</label>
                <input type="url" name="website_url" value={formData.website_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="https://yourwebsite.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Demo URL</label>
                <input type="url" name="demo_url" value={formData.demo_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="https://demo.yourwebsite.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Documentation URL</label>
                <input type="url" name="docs_url" value={formData.docs_url} onChange={handleChange} className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="https://docs.yourwebsite.com" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              Key Features
            </h2>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={feature} onChange={(e) => handleArrayChange('features', index, e.target.value)} className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="e.g., Real-time processing" />
                  {formData.features.length > 1 && (<button type="button" onClick={() => removeArrayItem('features', index)} className="px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors"><X className="w-5 h-5" /></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('features')} className="flex items-center gap-2 px-4 py-2 text-sm text-violet-400 hover:text-violet-300"><Plus className="w-4 h-4" />Add Feature</button>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-violet-400" />
              Tech Stack / Integration
            </h2>
            <div className="space-y-3">
              {formData.tech_stack.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <input type="text" value={tech} onChange={(e) => handleArrayChange('tech_stack', index, e.target.value)} className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500" placeholder="e.g., REST API, Python SDK" />
                  {formData.tech_stack.length > 1 && (<button type="button" onClick={() => removeArrayItem('tech_stack', index)} className="px-3 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400 hover:border-red-500/50 transition-colors"><X className="w-5 h-5" /></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('tech_stack')} className="flex items-center gap-2 px-4 py-2 text-sm text-violet-400 hover:text-violet-300"><Plus className="w-4 h-4" />Add Tech/Integration</button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-500">Your listing will be live immediately.</p>
            <button type="submit" disabled={loading || uploading} className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Uploading Image...' : loading ? 'Submitting...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import {
  Upload, Plus, X, AlertCircle, CheckCircle,
  Image as ImageIcon, DollarSign, Tag, FileText, Link as LinkIcon, Zap, Package
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
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [uploading, setUploading] = useState(false)
  const [deliverableFile, setDeliverableFile] = useState(null)
  const [deliverableUploading, setDeliverableUploading] = useState(false)

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
    is_nsfw: false,
  })
  const [needsReview, setNeedsReview] = useState(false)

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
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${needsReview ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`}>
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            {needsReview ? 'Listing Submitted for Review!' : 'Listing Published!'}
          </h1>
          <p className="text-slate-400 mb-6">
            {needsReview
              ? 'Your listing is pending admin approval due to NSFW content. This usually takes less than 24 hours.'
              : 'Your tool is now live on the marketplace!'}
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate(needsReview ? '/dashboard' : '/marketplace')} className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-semibold">
              {needsReview ? 'View Dashboard' : 'View Marketplace'}
            </button>
            <button onClick={() => { setSuccess(false); setNeedsReview(false); setImageFiles([]); setImagePreviews([]); setFormData({ title: '', short_description: '', description: '', category: 'text-nlp', emoji: '🤖', price_type: 'one-time', price: '', website_url: '', demo_url: '', docs_url: '', features: [''], tech_stack: [''], is_nsfw: false }); }} className="px-6 py-3 bg-slate-800 rounded-lg text-white font-medium">List Another Tool</button>
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
    const files = Array.from(e.target.files || [])
    if (imageFiles.length + files.length > 5) {
      setError('Maximum 5 images allowed')
      return
    }

    const validFiles = []
    const validPreviews = []

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Each image must be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select only image files')
        return
      }
      validFiles.push(file)
      validPreviews.push(URL.createObjectURL(file))
    }

    setImageFiles([...imageFiles, ...validFiles])
    setImagePreviews([...imagePreviews, ...validPreviews])
    setError('')
  }

  const uploadImages = async () => {
    if (imageFiles.length === 0) return []
    setUploading(true)
    const uploadedUrls = []

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i]
        const fileExt = file.name.split('.').pop()
        const fileName = user.id + '-' + Date.now() + '-' + i + '.' + fileExt
        const filePath = 'listings/' + fileName
        const { error: uploadError } = await supabase.storage.from('listing-images').upload(filePath, file)
        if (uploadError) throw uploadError
        const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
        uploadedUrls.push(data.publicUrl)
      }
      return uploadedUrls
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload images')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index))
    setImagePreviews(imagePreviews.filter((_, i) => i !== index))
  }

  const handleDeliverableSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 100 * 1024 * 1024) {
      setError('Deliverable file must be less than 100MB')
      return
    }
    setDeliverableFile(file)
    setError('')
  }

  const uploadDeliverable = async () => {
    if (!deliverableFile) return null
    setDeliverableUploading(true)

    try {
      const fileExt = deliverableFile.name.split('.').pop()
      const fileName = user.id + '-' + Date.now() + '-deliverable.' + fileExt
      const filePath = 'deliverables/' + fileName

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(filePath, deliverableFile)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('listing-images').getPublicUrl(filePath)
      return data.publicUrl
    } catch (error) {
      console.error('Deliverable upload error:', error)
      throw new Error('Failed to upload deliverable file')
    } finally {
      setDeliverableUploading(false)
    }
  }

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

      // Upload images
      const imageUrls = await uploadImages()
      const mainImageUrl = imageUrls.length > 0 ? imageUrls[0] : null

      // Upload deliverable
      const deliverableUrl = await uploadDeliverable()

      const priceValue = formData.price_type === 'free' || formData.price_type === 'contact' ? 0 : Math.round(parseFloat(formData.price))

      // Only NSFW listings require manual approval
      const requiresReview = formData.is_nsfw
      const listingStatus = requiresReview ? 'pending' : 'approved'

      const { error } = await supabase.from('listings').insert({
        seller_id: user.id,
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        description: formData.description.trim(),
        category: formData.category,
        emoji: formData.emoji,
        price_type: formData.price_type,
        price: priceValue,
        website_url: formData.website_url.trim() || null,
        demo_url: formData.demo_url.trim() || null,
        docs_url: formData.docs_url.trim() || null,
        features: features.length > 0 ? features : null,
        tech_stack: tech_stack.length > 0 ? tech_stack : null,
        image_url: mainImageUrl,
        images: imageUrls.length > 0 ? imageUrls : null,
        deliverable_url: deliverableUrl,
        status: listingStatus,
        is_nsfw: formData.is_nsfw,
        review_count: 0,
        purchase_count: 0,
      })
      if (error) throw error
      setNeedsReview(requiresReview)
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
              Product Images
              <span className="text-sm font-normal text-slate-500">({imagePreviews.length}/5)</span>
            </h2>

            {/* Image Previews Grid */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative aspect-video bg-slate-800 rounded-lg overflow-hidden">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-violet-500 text-white text-xs rounded">
                        Main
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {imagePreviews.length < 5 && (
              <label className={`flex flex-col items-center justify-center w-full ${imagePreviews.length > 0 ? 'h-32' : 'h-64'} border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors`}>
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className={`${imagePreviews.length > 0 ? 'w-6 h-6' : 'w-10 h-10'} text-slate-500 mb-2`} />
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-violet-400">Click to upload</span>
                    {imagePreviews.length === 0 && ' or drag and drop'}
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, WEBP (MAX 5MB each)</p>
                </div>
                <input type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
              </label>
            )}
            <p className="mt-2 text-xs text-slate-500">First image will be the main image. Recommended: 16:9 aspect ratio, at least 1280x720px</p>
          </div>

          {/* Deliverable Upload */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-violet-400" />
              Product Deliverable
            </h2>
            <p className="text-sm text-slate-400 mb-4">
              Upload the file buyers will receive after purchase (ZIP, PDF, etc.)
            </p>

            {deliverableFile ? (
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{deliverableFile.name}</p>
                    <p className="text-xs text-slate-500">{(deliverableFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDeliverableFile(null)}
                  className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">
                    <span className="font-semibold text-violet-400">Click to upload</span> deliverable
                  </p>
                  <p className="text-xs text-slate-500">ZIP, PDF, or any file (MAX 100MB)</p>
                </div>
                <input type="file" onChange={handleDeliverableSelect} className="hidden" />
              </label>
            )}
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

          {/* Content Rating */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-violet-400" />
              Content Rating
            </h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_nsfw}
                onChange={(e) => setFormData(prev => ({ ...prev, is_nsfw: e.target.checked }))}
                className="mt-1 w-5 h-5 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500 focus:ring-offset-slate-900"
              />
              <div>
                <span className="font-medium text-white">This product contains NSFW/Adult content</span>
                <p className="text-sm text-slate-400 mt-1">
                  Check this if your tool generates or processes adult content, explicit material, or is intended for mature audiences only.
                  NSFW listings require admin approval before going live.
                </p>
              </div>
            </label>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-500">
              {formData.is_nsfw ? 'NSFW listings require admin approval.' : 'Your listing will be live immediately.'}
            </p>
            <button type="submit" disabled={loading || uploading || deliverableUploading} className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 rounded-lg text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading ? 'Uploading Images...' : deliverableUploading ? 'Uploading Deliverable...' : loading ? 'Submitting...' : 'Submit Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

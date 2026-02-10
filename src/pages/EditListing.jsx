import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Upload, X, AlertCircle, CheckCircle, Image as ImageIcon, DollarSign, FileText, Link as LinkIcon, Zap, Plus } from 'lucide-react'

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
  { value: 'one-time', label: 'One-time' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'free', label: 'Free' },
  { value: 'contact', label: 'Contact' },
]

export default function EditListing() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    if (id && user) fetchListing()
  }, [id, user])

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase.from('listings').select('*').eq('id', id).single()
      if (error) throw error
      if (data.seller_id !== user.id) { navigate('/dashboard'); return }
      setFormData({
        title: data.title || '',
        short_description: data.short_description || '',
        description: data.description || '',
        category: data.category || 'text-nlp',
        emoji: data.emoji || '🤖',
        price_type: data.price_type || 'one-time',
        price: data.price ? String(Math.round(data.price)) : '',
        website_url: data.website_url || '',
        demo_url: data.demo_url || '',
        docs_url: data.docs_url || '',
        features: data.features && data.features.length ? data.features : [''],
        tech_stack: data.tech_stack && data.tech_stack.length ? data.tech_stack : [''],
        image_url: data.image_url || '',
      })
      if (data.image_url) setImagePreview(data.image_url)
    } catch (err) {
      setError('Failed to load listing')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...prev[field]]
      arr[index] = value
      return { ...prev, [field]: arr }
    })
  }

  const addArrayItem = (field) => setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }))

  const removeArrayItem = (field, index) => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))

  const handleImageSelect = (e) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('Image must be less than 5MB'); return }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return formData.image_url
    setUploading(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = user.id + '-' + Date.now() + '.' + fileExt
      const { error } = await supabase.storage.from('listing-images').upload('listings/' + fileName, imageFile)
      if (error) throw error
      const { data } = supabase.storage.from('listing-images').getPublicUrl('listings/' + fileName)
      return data.publicUrl
    } catch (err) {
      throw new Error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setFormData(prev => ({ ...prev, image_url: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (!formData.title.trim()) throw new Error('Title is required')
      let imageUrl = formData.image_url
      if (imageFile) imageUrl = await uploadImage()

      const priceValue = (formData.price_type === 'free' || formData.price_type === 'contact')
        ? 0
        : Math.round(parseFloat(formData.price))

      const { error } = await supabase.from('listings').update({
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
        features: formData.features.filter(f => f.trim()),
        tech_stack: formData.tech_stack.filter(t => t.trim()),
        image_url: imageUrl || null,
      }).eq('id', id)

      if (error) throw error
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 text-center text-white">
        Listing not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Edit Listing</h1>
        <p className="text-slate-400 mb-8">Update your tool listing</p>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="text-emerald-400">Listing updated! Redirecting...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-400" />
              Basic Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-2">Tool Name *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Emoji</label>
                  <input
                    type="text"
                    name="emoji"
                    value={formData.emoji}
                    onChange={handleChange}
                    maxLength={2}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-2xl text-center focus:ring-2 focus:ring-violet-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Short Description *</label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  maxLength={200}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-2">Full Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-violet-400" />
              Image
            </h2>
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800/50 hover:bg-slate-800">
                <Upload className="w-10 h-10 text-slate-500 mb-3" />
                <p className="text-sm text-slate-400">
                  <span className="text-violet-400 font-semibold">Click to upload</span>
                </p>
                <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-violet-400" />
              Pricing
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {priceTypes.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, price_type: t.value }))}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    formData.price_type === t.value
                      ? 'bg-violet-500/20 border-violet-500 text-white border'
                      : 'bg-slate-800 border-slate-700 text-slate-400 border'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {(formData.price_type === 'one-time' || formData.price_type === 'monthly') && (
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="1"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Links */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-violet-400" />
              Links
            </h2>
            <div className="space-y-4">
              <input
                type="url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
                placeholder="Website URL"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                placeholder="Demo URL"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
              <input
                type="url"
                name="docs_url"
                value={formData.docs_url}
                onChange={handleChange}
                placeholder="Documentation URL"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Features */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-400" />
              Features
            </h2>
            {formData.features.map((f, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={f}
                  onChange={e => handleArrayChange('features', i, e.target.value)}
                  placeholder="Feature"
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-violet-500 focus:outline-none"
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('features', i)}
                    className="px-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-red-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="text-violet-400 text-sm flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />Add
            </button>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4 pt-6 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-slate-800 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg text-white font-semibold disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

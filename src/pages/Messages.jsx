import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { MessageSquare, Send, ArrowLeft, User, X, Paperclip, FileText, Image, Download } from 'lucide-react'

export default function Messages() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState([])
  const [selectedConvo, setSelectedConvo] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  // New conversation from Contact Seller
  const [newConvoMode, setNewConvoMode] = useState(false)
  const [sellerInfo, setSellerInfo] = useState(null)
  const [listingInfo, setListingInfo] = useState(null)
  const [newConvoMessage, setNewConvoMessage] = useState('')

  // File upload
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const newConvoFileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      fetchConversations()
      checkForNewConvo()
    }
  }, [user])

  useEffect(() => {
    if (selectedConvo) fetchMessages(selectedConvo)
  }, [selectedConvo])

  const checkForNewConvo = async () => {
    const sellerId = searchParams.get('seller')
    const listingId = searchParams.get('listing')

    if (sellerId && sellerId !== user.id) {
      // Fetch seller info
      const { data: seller } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', sellerId)
        .single()

      if (seller) {
        setSellerInfo(seller)

        // Fetch listing info if provided
        if (listingId) {
          const { data: listing } = await supabase
            .from('listings')
            .select('id, title, emoji')
            .eq('id', listingId)
            .single()

          if (listing) setListingInfo(listing)
        }

        setNewConvoMode(true)
      }

      // Clear URL params
      setSearchParams({})
    }
  }

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(id, full_name), receiver:profiles!receiver_id(id, full_name), listing:listings(id, title, emoji)')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) throw error

      const convoMap = new Map()
      data.forEach(msg => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id
        const otherUser = msg.sender_id === user.id ? msg.receiver : msg.sender
        const key = `${otherUserId}-${msg.listing_id || 'general'}`

        if (!convoMap.has(key)) {
          convoMap.set(key, {
            oderId: otherUserId,
            otherUser,
            listing: msg.listing,
            lastMessage: msg,
            unread: msg.receiver_id === user.id && !msg.read ? 1 : 0
          })
        } else if (msg.receiver_id === user.id && !msg.read) {
          convoMap.get(key).unread++
        }
      })

      setConversations(Array.from(convoMap.values()))
    } catch (err) {
      console.error('Error fetching conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (convo) => {
    try {
      const otherUserId = convo.otherUser.id
      let query = supabase
        .from('messages')
        .select('*, sender:profiles!sender_id(id, full_name)')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true })

      if (convo.listing) {
        query = query.eq('listing_id', convo.listing.id)
      }

      const { data, error } = await query
      if (error) throw error
      setMessages(data || [])

      // Mark as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('receiver_id', user.id)
        .eq('sender_id', otherUserId)

    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  const handleFileSelect = (e, isNewConvo = false) => {
    const file = e.target.files?.[0]
    if (file) {
      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB')
        return
      }
      setSelectedFile(file)
    }
  }

  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`
    const filePath = `message-attachments/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath)

    return { url: publicUrl, name: file.name, type: file.type, size: file.size }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if ((!newMessage.trim() && !selectedFile) || !selectedConvo) return

    setSending(true)
    setUploading(!!selectedFile)

    try {
      let fileData = null
      if (selectedFile) {
        fileData = await uploadFile(selectedFile)
      }

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedConvo.otherUser.id,
        listing_id: selectedConvo.listing?.id || null,
        content: newMessage.trim() || (fileData ? `📎 Sent a file: ${fileData.name}` : ''),
        file_url: fileData?.url || null,
        file_name: fileData?.name || null,
        file_type: fileData?.type || null
      })

      if (error) throw error
      setNewMessage('')
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      fetchMessages(selectedConvo)
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
      setUploading(false)
    }
  }

  const startNewConversation = async (e) => {
    e.preventDefault()
    if ((!newConvoMessage.trim() && !selectedFile) || !sellerInfo) return

    setSending(true)
    setUploading(!!selectedFile)

    try {
      let fileData = null
      if (selectedFile) {
        fileData = await uploadFile(selectedFile)
      }

      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: sellerInfo.id,
        listing_id: listingInfo?.id || null,
        content: newConvoMessage.trim() || (fileData ? `📎 Sent a file: ${fileData.name}` : ''),
        file_url: fileData?.url || null,
        file_name: fileData?.name || null,
        file_type: fileData?.type || null
      })

      if (error) throw error

      setNewConvoMessage('')
      setSelectedFile(null)
      if (newConvoFileInputRef.current) newConvoFileInputRef.current.value = ''
      setNewConvoMode(false)
      setSellerInfo(null)
      setListingInfo(null)

      // Refresh conversations and select the new one
      await fetchConversations()

    } catch (err) {
      console.error('Error starting conversation:', err)
    } finally {
      setSending(false)
      setUploading(false)
    }
  }

  const cancelNewConvo = () => {
    setNewConvoMode(false)
    setSellerInfo(null)
    setListingInfo(null)
    setNewConvoMessage('')
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <p className="text-slate-400">Please log in to view messages</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-violet-400" />
          Messages
        </h1>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-slate-800 ${selectedConvo || newConvoMode ? 'hidden md:block' : ''}`}>
              <div className="p-4 border-b border-slate-800">
                <h2 className="font-semibold text-white">Conversations</h2>
              </div>
              <div className="overflow-y-auto" style={{ height: 'calc(600px - 57px)' }}>
                {loading ? (
                  <div className="p-4 text-center text-slate-500">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">No messages yet</div>
                ) : (
                  conversations.map((convo, i) => (
                    <button
                      key={i}
                      onClick={() => { setSelectedConvo(convo); setNewConvoMode(false); }}
                      className={`w-full p-4 text-left hover:bg-slate-800 transition-colors border-b border-slate-800/50 ${
                        selectedConvo?.otherUser?.id === convo.otherUser?.id ? 'bg-slate-800' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">
                          {convo.otherUser?.full_name?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white truncate">{convo.otherUser?.full_name || 'User'}</p>
                            {convo.unread > 0 && (
                              <span className="bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full">{convo.unread}</span>
                            )}
                          </div>
                          {convo.listing && (
                            <p className="text-xs text-violet-400 truncate">{convo.listing.emoji} {convo.listing.title}</p>
                          )}
                          <p className="text-sm text-slate-500 truncate">{convo.lastMessage?.content}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Messages View */}
            <div className={`flex-1 flex flex-col ${!selectedConvo && !newConvoMode ? 'hidden md:flex' : ''}`}>
              {/* New Conversation Mode */}
              {newConvoMode && sellerInfo ? (
                <>
                  <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <button
                      onClick={cancelNewConvo}
                      className="md:hidden p-2 text-slate-400 hover:text-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">
                      {sellerInfo.full_name?.charAt(0) || '?'}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{sellerInfo.full_name}</p>
                      {listingInfo && (
                        <p className="text-xs text-violet-400">
                          {listingInfo.emoji} {listingInfo.title}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={cancelNewConvo}
                      className="hidden md:block p-2 text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex-1 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                        {sellerInfo.full_name?.charAt(0) || '?'}
                      </div>
                      <p className="text-white font-medium mb-1">Start a conversation with {sellerInfo.full_name}</p>
                      {listingInfo && (
                        <p className="text-sm text-violet-400 mb-4">
                          About: {listingInfo.emoji} {listingInfo.title}
                        </p>
                      )}
                      <p className="text-slate-500 text-sm">Send a message to get started</p>
                    </div>
                  </div>

                  <form onSubmit={startNewConversation} className="p-4 border-t border-slate-800">
                    {/* Selected File Preview */}
                    {selectedFile && (
                      <div className="mb-2 p-2 bg-slate-800 rounded-lg flex items-center gap-2">
                        {selectedFile.type.startsWith('image/') ? (
                          <Image className="w-5 h-5 text-violet-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-violet-400" />
                        )}
                        <span className="text-sm text-slate-300 truncate flex-1">{selectedFile.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null)
                            if (newConvoFileInputRef.current) newConvoFileInputRef.current.value = ''
                          }}
                          className="text-slate-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={newConvoFileInputRef}
                        onChange={(e) => handleFileSelect(e, true)}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                      <button
                        type="button"
                        onClick={() => newConvoFileInputRef.current?.click()}
                        className="px-3 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Attach file"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={newConvoMessage}
                        onChange={(e) => setNewConvoMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                        autoFocus
                      />
                      <button
                        type="submit"
                        disabled={sending || (!newConvoMessage.trim() && !selectedFile)}
                        className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white disabled:opacity-50 transition-colors"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : selectedConvo ? (
                <>
                  <div className="p-4 border-b border-slate-800 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConvo(null)}
                      className="md:hidden p-2 text-slate-400 hover:text-white"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedConvo.otherUser?.full_name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <p className="font-medium text-white">{selectedConvo.otherUser?.full_name}</p>
                      {selectedConvo.listing && (
                        <Link to={`/listing/${selectedConvo.listing.id}`} className="text-xs text-violet-400 hover:underline">
                          {selectedConvo.listing.emoji} {selectedConvo.listing.title}
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            msg.sender_id === user.id
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-800 text-white'
                          } ${msg.is_system_message ? 'border border-emerald-500/50 bg-emerald-900/30' : ''}`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {/* File Attachment */}
                          {msg.file_url && (
                            <div className={`mt-2 p-2 rounded-lg ${msg.sender_id === user.id ? 'bg-violet-700/50' : 'bg-slate-700/50'}`}>
                              {msg.file_type?.startsWith('image/') ? (
                                <a href={msg.file_url} target="_blank" rel="noopener noreferrer">
                                  <img src={msg.file_url} alt={msg.file_name} className="max-w-full rounded-lg max-h-48 object-cover" />
                                </a>
                              ) : (
                                <a
                                  href={msg.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 hover:opacity-80"
                                >
                                  <FileText className="w-5 h-5 flex-shrink-0" />
                                  <span className="text-sm truncate">{msg.file_name || 'Download File'}</span>
                                  <Download className="w-4 h-4 flex-shrink-0" />
                                </a>
                              )}
                            </div>
                          )}
                          <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-violet-200' : 'text-slate-500'}`}>
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={sendMessage} className="p-4 border-t border-slate-800">
                    {/* Selected File Preview */}
                    {selectedFile && (
                      <div className="mb-2 p-2 bg-slate-800 rounded-lg flex items-center gap-2">
                        {selectedFile.type.startsWith('image/') ? (
                          <Image className="w-5 h-5 text-violet-400" />
                        ) : (
                          <FileText className="w-5 h-5 text-violet-400" />
                        )}
                        <span className="text-sm text-slate-300 truncate flex-1">{selectedFile.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null)
                            if (fileInputRef.current) fileInputRef.current.value = ''
                          }}
                          className="text-slate-500 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => handleFileSelect(e)}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Attach file"
                      >
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                      <button
                        type="submit"
                        disabled={sending || (!newMessage.trim() && !selectedFile)}
                        className="px-4 py-3 bg-violet-600 hover:bg-violet-500 rounded-lg text-white disabled:opacity-50 transition-colors"
                      >
                        {uploading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a conversation to view messages</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

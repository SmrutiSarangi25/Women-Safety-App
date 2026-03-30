import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, Send, Sparkles, X, Bot, User, AlertTriangle, Mic, MicOff, Volume2, VolumeX, Copy, Check, ThumbsUp, ThumbsDown, AlertCircle, Phone } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Config } from '../../API/Config'
import api from '../../API/CustomApi'

const QUICK_PROMPTS = [
  { text: 'I feel unsafe right now. What should I do?', category: 'emergency' },
  { text: 'How do I create a safety plan?', category: 'safety' },
  { text: 'Give me self-defence tips for beginners.', category: 'defense' },
  { text: 'What are important safety numbers to know?', category: 'resources' },
  { text: 'How do I stay safe while traveling?', category: 'travel' },
  { text: 'What should I do if being followed?', category: 'emergency' }
]

const SAFETY_RESOURCES = [
  { name: '🚔 Police', number: '100', color: 'bg-blue-500/20 text-blue-300' },
  { name: '🚨 Emergency', number: '112', color: 'bg-red-500/20 text-red-300' },
  { name: '📞 Women Helpline', number: '1091', color: 'bg-pink-500/20 text-pink-300' },
  { name: '💬 Complaint', number: '1930', color: 'bg-purple-500/20 text-purple-300' }
]

const STORAGE_KEY = 'raksha-ai-chat-history'
const LANG_STORAGE_KEY = 'raksha-ai-chat-language'

const LANGUAGE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'or', label: 'Odia' }
]

const VOICE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  or: 'or-IN'
}

function AIChatbot() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [speechEnabled, setSpeechEnabled] = useState(true)
  const [language, setLanguage] = useState(() => localStorage.getItem(LANG_STORAGE_KEY) || 'en')
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [messageFeedback, setMessageFeedback] = useState({})
  const [showResources, setShowResources] = useState(false)
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return []
      }
    }

    return [
      {
        role: 'assistant',
        content: 'Hi, I am your Raksha AI safety assistant. Ask me about emergency steps, personal safety plans, or self-defence basics.'
      }
    ]
  })

  const viewportRef = useRef(null)
  const recognitionRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, language)
  }, [language])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
  }, [messages])

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight
    }
  }, [messages, open, loading])

  const historyPayload = useMemo(() => messages.slice(-8), [messages])

  const speakText = (text) => {
    if (!speechEnabled || typeof window === 'undefined' || !window.speechSynthesis) return
    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.lang = VOICE_MAP[language] || 'en-IN'
    utterance.rate = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Voice input is not supported in this browser. Please type your message.' }
      ])
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = VOICE_MAP[language] || 'en-IN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ''
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript))
      }
    }

    recognitionRef.current = recognition
    recognition.start()
  }

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    setListening(false)
  }

  const sendMessage = async (contentFromPrompt = '') => {
    const text = (contentFromPrompt || input).trim()
    if (!text || loading) return

    const nextMessages = [...messages, { role: 'user', content: text }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post(Config.AI_CHAT_URL, {
        message: text,
        history: historyPayload,
        language,
        contextPage: location.pathname
      })

      const reply = data?.reply || 'I could not generate a response right now. Please try again.'
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
      speakText(reply)
    } catch (error) {
      const fallbackError = 'I am having trouble connecting right now. If this is urgent, call 112 or 100 immediately.'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallbackError
        }
      ])
      speakText(fallbackError)
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleFeedback = (msgIndex, isHelpful) => {
    setMessageFeedback((prev) => ({
      ...prev,
      [msgIndex]: isHelpful ? 'helpful' : 'not-helpful'
    }))
    setTimeout(() => {
      setMessageFeedback((prev) => {
        const updated = { ...prev }
        delete updated[msgIndex]
        return updated
      })
    }, 2000)
  }

  const clearChat = () => {
    const starter = [
      {
        role: 'assistant',
        content: 'Chat reset complete. Ask me anything about safety, emergency steps, or prevention.'
      }
    ]
    setMessages(starter)
  }

  return (
    <div className='fixed bottom-5 right-5 z-[140]'>
      {open && (
        <div className='mb-3 w-[92vw] max-w-md overflow-hidden rounded-3xl border-2 border-purple-500/30 bg-gradient-to-b from-slate-950 to-slate-900 shadow-2xl backdrop-blur-md'>
          {/* Header */}
          <div className='flex items-center justify-between border-b border-purple-500/20 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-rose-600/20 px-4 py-4'>
            <div className='flex items-center gap-3'>
              <div className='relative'>
                <Sparkles size={22} className='text-purple-300 animate-pulse' />
              </div>
              <div>
                <p className='text-sm font-bold text-white'>Raksha AI Assistant</p>
                <p className='text-xs text-slate-300'>Always here for your safety</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className='rounded-lg p-1.5 text-slate-300 transition hover:bg-red-500/20 hover:text-red-300'
              aria-label='Close chatbot'
            >
              <X size={18} />
            </button>
          </div>

          {/* Controls */}
          <div className='border-b border-purple-500/20 bg-slate-900/50 px-3 py-3'>
            <div className='flex items-center justify-between gap-2 mb-2'>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className='rounded-lg border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs font-semibold text-white focus:border-purple-300 focus:outline-none'
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value} className='bg-slate-900 text-white'>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className='flex items-center gap-1'>
                <button
                  type='button'
                  onClick={() => setSpeechEnabled((prev) => !prev)}
                  className='rounded-lg border border-purple-500/30 bg-purple-500/10 p-1.5 text-slate-100 hover:bg-purple-500/20 transition'
                  aria-label='Toggle voice output'
                >
                  {speechEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                </button>
                <button
                  type='button'
                  onClick={listening ? stopVoiceInput : startVoiceInput}
                  className={`rounded-lg border p-1.5 text-slate-100 transition ${
                    listening ? 'border-rose-400 bg-rose-500/30 animate-pulse' : 'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20'
                  }`}
                  aria-label='Toggle voice input'
                >
                  {listening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
                <button
                  type='button'
                  onClick={() => setShowResources(!showResources)}
                  className='rounded-lg border border-purple-500/30 bg-purple-500/10 p-1.5 text-slate-100 hover:bg-purple-500/20 transition'
                  aria-label='Toggle resources'
                >
                  <AlertCircle size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Resources Section */}
          {showResources && (
            <div className='border-b border-purple-500/20 bg-gradient-to-r from-red-500/10 to-purple-500/10 px-3 py-3'>
              <p className='text-xs font-bold text-rose-300 mb-2 uppercase'>Emergency Resources</p>
              <div className='grid grid-cols-2 gap-2'>
                {SAFETY_RESOURCES.map((resource) => (
                  <div
                    key={resource.number}
                    className={`rounded-lg ${resource.color} border border-current/30 p-2 text-center cursor-pointer hover:scale-105 transition`}
                  >
                    <p className='text-xs font-bold'>{resource.name}</p>
                    <p className='text-sm font-bold'>{resource.number}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div ref={viewportRef} className='max-h-[50vh] space-y-3 overflow-y-auto px-3 py-3'>
            {!showResources && (
              <div className='rounded-lg border border-rose-300/30 bg-rose-500/10 p-2 text-xs text-rose-200 animate-pulse'>
                <p className='flex items-center gap-1.5 font-semibold'>
                  <AlertTriangle size={13} />
                  For life-threatening danger: Call 112 or 100 immediately
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed transition ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                      : 'border border-purple-500/30 bg-slate-800/50 text-slate-100'
                  }`}
                >
                  <p className='mb-1 text-xs opacity-75 font-semibold uppercase tracking-wide'>
                    {msg.role === 'user' ? '👤 You' : '🤖 Assistant'}
                  </p>
                  <p className='mb-2'>{msg.content}</p>

                  {msg.role === 'assistant' && (
                    <div className='flex items-center gap-1 text-xs'>
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className='flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 transition'
                      >
                        {copiedIndex === idx ? <Check size={12} /> : <Copy size={12} />}
                        {copiedIndex === idx ? 'Copied' : 'Copy'}
                      </button>
                      {messageFeedback[idx] === undefined && (
                        <div className='flex gap-1 ml-auto'>
                          <button
                            onClick={() => handleFeedback(idx, true)}
                            className='p-1 rounded hover:bg-green-500/20'
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button
                            onClick={() => handleFeedback(idx, false)}
                            className='p-1 rounded hover:bg-red-500/20'
                          >
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                      {messageFeedback[idx] === 'helpful' && (
                        <span className='text-green-400 text-xs ml-auto'>✓ Thanks!</span>
                      )}
                      {messageFeedback[idx] === 'not-helpful' && (
                        <span className='text-red-400 text-xs ml-auto'>We'll improve</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className='flex justify-start animate-in fade-in'>
                <div className='rounded-2xl border border-purple-500/30 bg-slate-800/50 px-4 py-3'>
                  <div className='flex items-center gap-2'>
                    <div className='flex gap-1'>
                      <div className='h-2 w-2 rounded-full bg-purple-400 animate-bounce' style={{ animationDelay: '0ms' }}></div>
                      <div className='h-2 w-2 rounded-full bg-pink-400 animate-bounce' style={{ animationDelay: '150ms' }}></div>
                      <div className='h-2 w-2 rounded-full bg-rose-400 animate-bounce' style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className='text-xs text-slate-400'>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className='border-t border-purple-500/20 bg-slate-900/50 px-3 py-2 max-h-[20vh] overflow-y-auto'>
            <p className='text-xs font-bold text-purple-300 mb-2 uppercase'>Quick Questions</p>
            <div className='flex flex-wrap gap-2'>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => sendMessage(prompt.text)}
                  disabled={loading}
                  className='rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs text-slate-200 hover:bg-purple-500/20 transition truncate disabled:opacity-50'
                  type='button'
                  title={prompt.text}
                >
                  {prompt.text.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>

          {/* Input Section */}
          <div className='border-t border-purple-500/20 px-3 pb-3 pt-3'>
            <div className='flex items-end gap-2'>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder='Ask anything about safety...'
                className='min-h-[44px] flex-1 resize-none rounded-xl border-2 border-purple-500/30 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus:border-purple-400 focus:outline-none transition'
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white disabled:cursor-not-allowed disabled:opacity-50 hover:scale-105 transition shadow-lg'
                type='button'
                aria-label='Send message'
              >
                <Send size={18} />
              </button>
            </div>

            <div className='mt-2 flex items-center justify-between text-xs'>
              <button
                type='button'
                onClick={clearChat}
                className='text-slate-400 hover:text-purple-300 transition font-semibold'
              >
                Clear History
              </button>
              <p className='text-slate-500'>AI may be wrong. Verify info.</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='group flex items-center gap-2 rounded-full border-2 border-purple-500/30 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 px-5 py-4 text-sm font-bold text-white shadow-2xl transition hover:scale-110 hover:shadow-pink-500/50'
        type='button'
        aria-label='Open AI chatbot'
      >
        <MessageCircle size={20} className='transition group-hover:rotate-12 group-hover:scale-125' />
        <span>AI Help</span>
      </button>
    </div>
  )
}

export default AIChatbot

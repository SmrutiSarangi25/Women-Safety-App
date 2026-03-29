import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, Send, Sparkles, X, Bot, User, AlertTriangle, Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { Config } from '../../API/Config'
import api from '../../API/CustomApi'

const QUICK_PROMPTS = [
  'I feel unsafe while traveling. What should I do?',
  'How do I build a strong safety plan?',
  'What should I do during an emergency right now?',
  'Give me self-defence tips for beginners.'
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
        <div className='mb-3 w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-slate-950/95 shadow-2xl backdrop-blur-md'>
          <div className='flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-cyan-500/20 via-rose-500/20 to-orange-500/20 px-4 py-3'>
            <div className='flex items-center gap-2'>
              <Sparkles size={18} className='text-cyan-200' />
              <div>
                <p className='text-sm font-bold text-white'>Raksha AI Assistant</p>
                <p className='text-[11px] text-slate-300'>Safety guidance, 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className='rounded-lg p-1.5 text-slate-300 transition hover:bg-white/10 hover:text-white'
              aria-label='Close chatbot'
            >
              <X size={16} />
            </button>
          </div>

          <div className='flex items-center justify-between gap-2 border-b border-white/10 bg-slate-900/70 px-3 py-2'>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-xs font-semibold text-white focus:border-cyan-300 focus:outline-none'
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
                className='rounded-lg border border-white/20 bg-white/10 p-1.5 text-slate-100 hover:bg-white/20'
                aria-label='Toggle voice output'
              >
                {speechEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>
              <button
                type='button'
                onClick={listening ? stopVoiceInput : startVoiceInput}
                className={`rounded-lg border p-1.5 text-slate-100 ${listening ? 'border-rose-300 bg-rose-500/30' : 'border-white/20 bg-white/10 hover:bg-white/20'}`}
                aria-label='Toggle voice input'
              >
                {listening ? <MicOff size={14} /> : <Mic size={14} />}
              </button>
            </div>
          </div>

          <div ref={viewportRef} className='max-h-[52vh] space-y-3 overflow-y-auto px-3 py-3'>
            <div className='rounded-lg border border-amber-300/30 bg-amber-500/10 p-2 text-[11px] text-amber-100'>
              <p className='flex items-center gap-1.5'>
                <AlertTriangle size={12} />
                For immediate danger, call 112 or 100 now.
              </p>
            </div>

            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
                      : 'border border-white/20 bg-white/10 text-slate-100'
                  }`}
                >
                  <div className='mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wide opacity-80'>
                    {msg.role === 'user' ? <User size={11} /> : <Bot size={11} />}
                    {msg.role}
                  </div>
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}

            {loading && (
              <div className='flex justify-start'>
                <div className='rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-slate-200'>
                  Typing...
                </div>
              </div>
            )}
          </div>

          <div className='border-t border-white/10 px-3 pb-3 pt-2'>
            <div className='mb-2 flex flex-wrap gap-1.5'>
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className='rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] text-slate-100 hover:bg-white/20'
                  type='button'
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className='flex items-end gap-2'>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                placeholder='Ask safety question...'
                className='min-h-[44px] flex-1 resize-none rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-300 focus:border-cyan-300 focus:outline-none'
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className='flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-rose-500 text-white disabled:cursor-not-allowed disabled:opacity-50'
                type='button'
                aria-label='Send message'
              >
                <Send size={16} />
              </button>
            </div>

            <div className='mt-2 flex items-center justify-between'>
              <button
                type='button'
                onClick={clearChat}
                className='text-[11px] font-semibold text-slate-300 hover:text-white'
              >
                Clear chat
              </button>
              <p className='text-[10px] text-slate-400'>AI can make mistakes. Use judgment.</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((prev) => !prev)}
        className='group flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-cyan-500 to-rose-500 px-4 py-3 text-sm font-bold text-white shadow-2xl transition hover:scale-105'
        type='button'
        aria-label='Open AI chatbot'
      >
        <MessageCircle size={18} className='transition group-hover:rotate-6' />
        AI Help
      </button>
    </div>
  )
}

export default AIChatbot

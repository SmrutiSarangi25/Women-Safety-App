import axios from 'axios'
import AIAnalytics from '../Models/AIAnalyticsModel.js'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

// Basic in-memory rate limit to reduce abuse on public endpoint.
const requestLog = new Map()
const RATE_WINDOW_MS = 60 * 1000
const RATE_MAX_REQUESTS = 20

const SUPPORTED_LANGUAGES = {
  en: 'English',
  hi: 'Hindi',
  or: 'Odia'
}

const APP_CONTEXT = {
  faq: [
    'Users can contact support via email support@raksha.app and phone +91 9937012168.',
    'For emergencies, users should call 112/100 immediately and use SOS in app.',
    'Safety bubble and emergency contacts should be configured for quick response.'
  ],
  learn: [
    'Learning topics include emergency preparedness, digital safety, legal rights, and situational awareness.',
    'Self-defence guidance focuses on awareness, de-escalation, and escape first.',
    'Safety planning should include trusted contacts and route planning.'
  ],
  selfDefence: [
    'Self-defence advice must prioritize escape and avoiding escalation.',
    'Use voice, create distance, and move to a safer place quickly.'
  ],
  general: [
    'Raksha app provides SOS alerts, location sharing, and trusted contact workflows.',
    'Safety advice should be practical, calm, and clear.'
  ]
}

const inMemoryAnalytics = {
  totalRequests: 0,
  fallbackResponses: 0,
  providerResponses: 0,
  byLanguage: { en: 0, hi: 0, or: 0 },
  byContext: { faq: 0, learn: 0, selfDefence: 0, general: 0 },
  intentCounters: {
    emergency: 0,
    travel: 0,
    harassment: 0,
    selfDefence: 0,
    legal: 0,
    digital: 0,
    other: 0
  },
  lastRequests: []
}

const SAFETY_FALLBACKS = [
  'If you are in immediate danger, call emergency services right now: India 112 or 100.',
  'Share your live location with a trusted contact and move to a public, well-lit place.',
  'Keep your phone charged, emergency contacts updated, and SOS alerts enabled in the app.',
  'If harassment happens, document details safely and reach out to trusted people for support.'
]

function isRateLimited(ip) {
  const now = Date.now()
  const entries = requestLog.get(ip) || []
  const fresh = entries.filter((ts) => now - ts < RATE_WINDOW_MS)

  if (fresh.length >= RATE_MAX_REQUESTS) {
    requestLog.set(ip, fresh)
    return true
  }

  fresh.push(now)
  requestLog.set(ip, fresh)
  return false
}

function sanitizeMessages(messages = []) {
  return messages
    .filter((msg) => msg && typeof msg.role === 'string' && typeof msg.content === 'string')
    .map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content.trim().slice(0, 1500)
    }))
    .filter((msg) => msg.content.length > 0)
    .slice(-10)
}

function fallbackReply(userInput = '') {
  const normalized = userInput.toLowerCase()

  if (normalized.includes('emergency') || normalized.includes('danger') || normalized.includes('help')) {
    return `${SAFETY_FALLBACKS[0]} ${SAFETY_FALLBACKS[1]}`
  }

  if (normalized.includes('stalk') || normalized.includes('harass')) {
    return 'If someone is stalking or harassing you, prioritize your immediate safety first. Move toward people, call 112/100, and notify a trusted contact. If safe, record date/time/location details for reporting.'
  }

  if (normalized.includes('self defence') || normalized.includes('self defense')) {
    return 'Focus on awareness, distance, and escape first. Use your voice confidently, target vulnerable areas only to create space, and immediately move to safety. You can explore practical guides in the Self Defence section of this app.'
  }

  return SAFETY_FALLBACKS[Math.floor(Math.random() * SAFETY_FALLBACKS.length)]
}

function resolveIntent(text = '') {
  const normalized = text.toLowerCase()
  if (/(emergency|danger|urgent|sos|help now)/.test(normalized)) return 'emergency'
  if (/(travel|cab|taxi|bus|night|commute)/.test(normalized)) return 'travel'
  if (/(harass|stalk|threat|abuse)/.test(normalized)) return 'harassment'
  if (/(self defence|self defense|attack|escape)/.test(normalized)) return 'selfDefence'
  if (/(legal|police|complaint|fir|rights)/.test(normalized)) return 'legal'
  if (/(online|digital|cyber|social media|privacy)/.test(normalized)) return 'digital'
  return 'other'
}

function resolveLanguage(languageCode) {
  if (typeof languageCode !== 'string') return 'en'
  const safe = languageCode.trim().toLowerCase()
  return SUPPORTED_LANGUAGES[safe] ? safe : 'en'
}

function resolveContextKey(contextPage = '') {
  if (typeof contextPage !== 'string') return 'general'
  const normalized = contextPage.toLowerCase()
  if (normalized.includes('faq')) return 'faq'
  if (normalized.includes('learn')) return 'learn'
  if (normalized.includes('self-defence') || normalized.includes('selfdefence')) return 'selfDefence'
  return 'general'
}

function recordMemoryAnalytics({ message, language, source, contextKey }) {
  inMemoryAnalytics.totalRequests += 1
  inMemoryAnalytics.byLanguage[language] = (inMemoryAnalytics.byLanguage[language] || 0) + 1
  inMemoryAnalytics.byContext[contextKey] = (inMemoryAnalytics.byContext[contextKey] || 0) + 1

  if (source.startsWith('fallback')) {
    inMemoryAnalytics.fallbackResponses += 1
  } else {
    inMemoryAnalytics.providerResponses += 1
  }

  const intent = resolveIntent(message)
  inMemoryAnalytics.intentCounters[intent] += 1

  inMemoryAnalytics.lastRequests.unshift({
    intent,
    source,
    language,
    contextKey,
    at: new Date().toISOString(),
    preview: message.slice(0, 80)
  })

  inMemoryAnalytics.lastRequests = inMemoryAnalytics.lastRequests.slice(0, 30)
}

async function recordPersistentAnalytics({ message, language, source, contextKey }) {
  const intent = resolveIntent(message)

  const inc = {
    totalRequests: 1,
    [`byLanguage.${language}`]: 1,
    [`byContext.${contextKey}`]: 1,
    [`intentCounters.${intent}`]: 1,
    ...(source.startsWith('fallback') ? { fallbackResponses: 1 } : { providerResponses: 1 })
  }

  const lastRequest = {
    intent,
    source,
    language,
    contextKey,
    at: new Date(),
    preview: message.slice(0, 80)
  }

  await AIAnalytics.findOneAndUpdate(
    { key: 'global' },
    {
      $setOnInsert: { key: 'global' },
      $inc: inc,
      $push: {
        lastRequests: {
          $each: [lastRequest],
          $position: 0,
          $slice: 30
        }
      }
    },
    { upsert: true, new: false }
  )
}

async function recordAnalytics(payload) {
  recordMemoryAnalytics(payload)

  try {
    await recordPersistentAnalytics(payload)
  } catch (error) {
    // Non-blocking: analytics failure should not break chat.
    console.error('AI analytics persistence error:', error.message)
  }
}

export const chatWithAssistant = async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'

    if (isRateLimited(clientIp)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait a moment and try again.'
      })
    }

    const { message, history = [], language = 'en', contextPage = 'general' } = req.body || {}

    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid message.'
      })
    }

    const trimmedMessage = message.trim().slice(0, 2000)
    const safeHistory = sanitizeMessages(history)
    const apiKey = process.env.OPENAI_API_KEY || ''
    const safeLanguage = resolveLanguage(language)
    const contextKey = resolveContextKey(contextPage)
    const contextLines = APP_CONTEXT[contextKey] || APP_CONTEXT.general

    if (!apiKey) {
      const source = 'fallback'
      await recordAnalytics({
        message: trimmedMessage,
        language: safeLanguage,
        source,
        contextKey
      })
      return res.status(200).json({
        success: true,
        reply: fallbackReply(trimmedMessage),
        source
      })
    }

    const systemPrompt = `You are Raksha AI, a safety-focused assistant inside a women's safety application. Keep answers practical, calm, and concise.
- For urgent danger: instruct user to contact emergency services immediately (India: 112/100).
- Give step-by-step advice when possible.
- Avoid legal/medical certainty claims; suggest professional help when needed.
- Never provide harmful instructions.
- Reply in ${SUPPORTED_LANGUAGES[safeLanguage]}.

Relevant app context:
${contextLines.map((line) => `- ${line}`).join('\n')}`

    const completion = await axios.post(
      OPENAI_API_URL,
      {
        model: AI_MODEL,
        temperature: 0.4,
        max_tokens: 350,
        messages: [
          { role: 'system', content: systemPrompt },
          ...safeHistory,
          { role: 'user', content: trimmedMessage }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    )

    const reply = completion?.data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      const source = 'fallback-empty'
      await recordAnalytics({
        message: trimmedMessage,
        language: safeLanguage,
        source,
        contextKey
      })
      return res.status(200).json({
        success: true,
        reply: fallbackReply(trimmedMessage),
        source
      })
    }

    const source = 'openai'
    await recordAnalytics({
      message: trimmedMessage,
      language: safeLanguage,
      source,
      contextKey
    })

    return res.status(200).json({
      success: true,
      reply,
      source
    })
  } catch (error) {
    console.error('AI chat error:', error?.response?.data || error.message)
    const safeLanguage = resolveLanguage(req.body?.language)
    const contextKey = resolveContextKey(req.body?.contextPage)
    const source = 'fallback-error'
    await recordAnalytics({
      message: (req.body?.message || '').toString(),
      language: safeLanguage,
      source,
      contextKey
    })
    return res.status(200).json({
      success: true,
      reply: fallbackReply(req.body?.message || ''),
      source
    })
  }
}

export const getAIAnalytics = async (req, res) => {
  let analyticsSnapshot = null

  try {
    analyticsSnapshot = await AIAnalytics.findOne({ key: 'global' }).lean()
  } catch (error) {
    console.error('AI analytics fetch error:', error.message)
  }

  const analytics = analyticsSnapshot
    ? {
        totalRequests: analyticsSnapshot.totalRequests || 0,
        fallbackResponses: analyticsSnapshot.fallbackResponses || 0,
        providerResponses: analyticsSnapshot.providerResponses || 0,
        byLanguage: analyticsSnapshot.byLanguage || { en: 0, hi: 0, or: 0 },
        byContext: analyticsSnapshot.byContext || { faq: 0, learn: 0, selfDefence: 0, general: 0 },
        intentCounters: analyticsSnapshot.intentCounters || {
          emergency: 0,
          travel: 0,
          harassment: 0,
          selfDefence: 0,
          legal: 0,
          digital: 0,
          other: 0
        },
        lastRequests: analyticsSnapshot.lastRequests || []
      }
    : inMemoryAnalytics

  return res.status(200).json({
    success: true,
    analytics: {
      ...analytics,
      providerRate: analytics.totalRequests
        ? Math.round((analytics.providerResponses / analytics.totalRequests) * 100)
        : 0
    }
  })
}

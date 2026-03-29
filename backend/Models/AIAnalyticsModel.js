import mongoose from 'mongoose'

const requestLogSchema = new mongoose.Schema(
  {
    intent: {
      type: String,
      enum: ['emergency', 'travel', 'harassment', 'selfDefence', 'legal', 'digital', 'other'],
      default: 'other'
    },
    source: {
      type: String,
      default: 'fallback'
    },
    language: {
      type: String,
      enum: ['en', 'hi', 'or'],
      default: 'en'
    },
    contextKey: {
      type: String,
      enum: ['faq', 'learn', 'selfDefence', 'general'],
      default: 'general'
    },
    at: {
      type: Date,
      default: Date.now
    },
    preview: {
      type: String,
      default: ''
    }
  },
  { _id: false }
)

const aiAnalyticsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: 'global'
    },
    totalRequests: {
      type: Number,
      default: 0
    },
    fallbackResponses: {
      type: Number,
      default: 0
    },
    providerResponses: {
      type: Number,
      default: 0
    },
    byLanguage: {
      en: { type: Number, default: 0 },
      hi: { type: Number, default: 0 },
      or: { type: Number, default: 0 }
    },
    byContext: {
      faq: { type: Number, default: 0 },
      learn: { type: Number, default: 0 },
      selfDefence: { type: Number, default: 0 },
      general: { type: Number, default: 0 }
    },
    intentCounters: {
      emergency: { type: Number, default: 0 },
      travel: { type: Number, default: 0 },
      harassment: { type: Number, default: 0 },
      selfDefence: { type: Number, default: 0 },
      legal: { type: Number, default: 0 },
      digital: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    lastRequests: {
      type: [requestLogSchema],
      default: []
    }
  },
  { timestamps: true }
)

const AIAnalytics = mongoose.model('AIAnalytics', aiAnalyticsSchema)

export default AIAnalytics

import mongoose from 'mongoose'

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    mimeType: String,
    size: Number,
    storagePath: String
  },
  { _id: false }
)

const emailDeliverySchema = new mongoose.Schema(
  {
    attemptedAt: Date,
    adminNotified: {
      type: Boolean,
      default: false
    },
    userConfirmationSent: {
      type: Boolean,
      default: false
    },
    lastError: String
  },
  { _id: false }
)

const contactSubmissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    subjectCategory: {
      type: String,
      enum: ['general', 'support', 'partnership', 'feedback', 'emergency', 'other'],
      default: 'other'
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: ['normal', 'high'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['new', 'in_progress', 'resolved'],
      default: 'new'
    },
    attachment: attachmentSchema,
    emailDelivery: emailDeliverySchema,
    sourceIp: String,
    userAgent: String,
    adminNotes: String
  },
  { timestamps: true }
)

contactSubmissionSchema.index({ priority: 1, status: 1, createdAt: -1 })
contactSubmissionSchema.index({ email: 1, createdAt: -1 })

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema)

export default ContactSubmission

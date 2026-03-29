import mongoose from 'mongoose'

const sosSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    location: {
      latitude: Number,
      longitude: Number,
      address: String,
      accuracy: Number
    },
    contacts: [{
      name: String,
      phone: String,
      email: String,
      notificationMethod: {
        type: String,
        enum: ['sms', 'email', 'whatsapp'],
        default: 'sms'
      },
      notificationSent: Boolean,
      sentAt: Date
    }],
    alertMessage: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'high'
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'false_alarm'],
      default: 'active'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    resolvedAt: Date,
    notes: String,
    evidence: {
      audioUrl: String,
      cloudinaryPublicId: String,
      mimeType: String,
      transcript: String,
      typedFallback: String,
      uploadedAt: Date
    }
  },
  { timestamps: true }
)

const SOS = mongoose.model('SOS', sosSchema)

export default SOS

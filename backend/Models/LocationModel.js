import mongoose from 'mongoose'

const locationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    },
    accuracy: Number,
    speed: Number,
    heading: Number,
    address: String,
    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isSharing: {
      type: Boolean,
      default: false
    },
    sharingExpiresAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400 // Auto-delete after 24 hours
    }
  },
  { timestamps: true }
)

// Create index for faster queries
locationSchema.index({ userId: 1, createdAt: -1 })
locationSchema.index({ "coordinates": "2dsphere" })

const Location = mongoose.model('Location', locationSchema)

export default Location

import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ['super_admin', 'moderator', 'support'],
      default: 'moderator'
    },
    permissions: {
      manageUsers: { type: Boolean, default: false },
      viewReports: { type: Boolean, default: false },
      manageSOS: { type: Boolean, default: false },
      manageContent: { type: Boolean, default: false },
      systemSettings: { type: Boolean, default: false }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvalDate: Date,
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
)

const Admin = mongoose.model('Admin', adminSchema)

export default Admin

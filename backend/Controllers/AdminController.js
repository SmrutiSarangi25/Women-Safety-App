import Admin from '../Models/AdminModel.js'
import User from '../Models/UserModel.js'
import SOS from '../Models/SOSModel.js'
import ContactSubmission from '../Models/ContactSubmissionModel.js'

// Get all users (admin only)
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query

    let filter = {}
    if (role) filter.role = role
    if (status) filter.status = status

    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(filter)

    res.status(200).json({
      success: true,
      users,
      totalUsers: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const sosAlerts = await SOS.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      user,
      sosAlerts,
      totalAlerts: sosAlerts.length
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Suspend/Unsuspend user
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params
    const { status, reason } = req.body

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        status,
        suspensionReason: reason || ''
      },
      { new: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: `User ${status} successfully`,
      user
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get all SOS alerts
export const getAllSOSAlerts = async (req, res) => {
  try {
    const { status, severity, page = 1, limit = 10 } = req.query

    let filter = {}
    if (status) filter.status = status
    if (severity) filter.severity = severity

    const alerts = await SOS.find(filter)
      .populate('userId', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await SOS.countDocuments(filter)

    res.status(200).json({
      success: true,
      alerts,
      totalAlerts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update SOS alert status
export const updateSOSStatus = async (req, res) => {
  try {
    const { alertId } = req.params
    const { status, notes } = req.body

    const alert = await SOS.findByIdAndUpdate(
      alertId,
      {
        status,
        notes,
        resolvedAt: status === 'resolved' ? new Date() : null
      },
      { new: true }
    ).populate('userId', 'name email phone')

    res.status(200).json({
      success: true,
      message: 'SOS status updated successfully',
      alert
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const activeUsers = await User.countDocuments({ status: 'active' })
    const totalSOSAlerts = await SOS.countDocuments()
    const activeAlerts = await SOS.countDocuments({ status: 'active' })
    const resolvedAlerts = await SOS.countDocuments({ status: 'resolved' })
    const totalContactSubmissions = await ContactSubmission.countDocuments()
    const unresolvedContactSubmissions = await ContactSubmission.countDocuments({ status: { $ne: 'resolved' } })
    const emergencyContactSubmissions = await ContactSubmission.countDocuments({ priority: 'high' })

    // Get alerts in last 24 hours
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)
    const alertsLast24h = await SOS.countDocuments({ createdAt: { $gte: last24Hours } })

    // Get high severity alerts
    const criticalAlerts = await SOS.countDocuments({ severity: 'critical', status: 'active' })

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        suspendedUsers: totalUsers - activeUsers,
        totalSOSAlerts,
        activeAlerts,
        resolvedAlerts,
        totalContactSubmissions,
        unresolvedContactSubmissions,
        emergencyContactSubmissions,
        alertsLast24h,
        criticalAlerts
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get contact submissions for support management
export const getContactSubmissions = async (req, res) => {
  try {
    const { status, priority, subjectCategory, page = 1, limit = 10, search } = req.query

    const normalizedPage = Number(page) || 1
    const normalizedLimit = Math.min(Number(limit) || 10, 100)

    const filter = {}
    if (status) filter.status = status
    if (priority) filter.priority = priority
    if (subjectCategory) filter.subjectCategory = subjectCategory

    if (search) {
      const searchRegex = new RegExp(search, 'i')
      filter.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ]
    }

    const submissions = await ContactSubmission.find(filter)
      .sort({ priority: -1, createdAt: -1 })
      .skip((normalizedPage - 1) * normalizedLimit)
      .limit(normalizedLimit)

    const total = await ContactSubmission.countDocuments(filter)

    res.status(200).json({
      success: true,
      submissions,
      totalSubmissions: total,
      totalPages: Math.ceil(total / normalizedLimit),
      currentPage: normalizedPage
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get one contact submission
export const getContactSubmissionDetails = async (req, res) => {
  try {
    const { submissionId } = req.params
    const submission = await ContactSubmission.findById(submissionId)

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' })
    }

    res.status(200).json({ success: true, submission })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Update contact submission status
export const updateContactSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params
    const { status, adminNotes } = req.body

    if (!['new', 'in_progress', 'resolved'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' })
    }

    const submission = await ContactSubmission.findByIdAndUpdate(
      submissionId,
      {
        status,
        adminNotes: adminNotes?.trim() || undefined
      },
      { new: true }
    )

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Contact submission not found' })
    }

    res.status(200).json({
      success: true,
      message: 'Contact submission updated successfully',
      submission
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne({ userId: req.user.id })
      .populate('userId', 'name email phone profileImage')

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin profile not found' })
    }

    res.status(200).json({
      success: true,
      admin
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Give/Revoke admin access
export const grantAdminAccess = async (req, res) => {
  try {
    const { userId, role, permissions } = req.body

    // Only super_admin can grant access
    const requestor = await Admin.findOne({ userId: req.user.id })
    if (requestor.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can grant access' })
    }

    let admin = await Admin.findOne({ userId })

    if (admin) {
      admin.role = role
      admin.permissions = permissions
      admin.approvedBy = req.user.id
      admin.approvalDate = new Date()
      await admin.save()
    } else {
      admin = new Admin({
        userId,
        role,
        permissions,
        approvedBy: req.user.id,
        approvalDate: new Date()
      })
      await admin.save()
    }

    res.status(200).json({
      success: true,
      message: 'Admin access granted successfully',
      admin
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// Revoke admin access
export const revokeAdminAccess = async (req, res) => {
  try {
    const { userId } = req.params

    // Only super_admin can revoke access
    const requestor = await Admin.findOne({ userId: req.user.id })
    if (requestor.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Only super admin can revoke access' })
    }

    await Admin.findOneAndDelete({ userId })

    res.status(200).json({
      success: true,
      message: 'Admin access revoked successfully'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

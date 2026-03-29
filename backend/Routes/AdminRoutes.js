import express from 'express'
import {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  getAllSOSAlerts,
  updateSOSStatus,
  getSystemStats,
  getAdminProfile,
  grantAdminAccess,
  revokeAdminAccess,
  getContactSubmissions,
  getContactSubmissionDetails,
  updateContactSubmissionStatus
} from '../Controllers/AdminController.js'
import { verifyAdmin, checkPermission } from '../Middlewares/AdminAuth.js'

const router = express.Router()

// Admin profile
router.get('/admin/profile', verifyAdmin, getAdminProfile)

// System statistics
router.get('/admin/stats', verifyAdmin, getSystemStats)

// User management routes
router.get('/admin/users', verifyAdmin, checkPermission(['manageUsers']), getAllUsers)
router.get('/admin/users/:userId', verifyAdmin, checkPermission(['manageUsers']), getUserDetails)
router.put('/admin/users/:userId/status', verifyAdmin, checkPermission(['manageUsers']), updateUserStatus)

// SOS alert management routes
router.get('/admin/sos-alerts', verifyAdmin, checkPermission(['manageSOS']), getAllSOSAlerts)
router.put('/admin/sos-alerts/:alertId', verifyAdmin, checkPermission(['manageSOS']), updateSOSStatus)

// Admin access control (super admin only)
router.post('/admin/grant-access', verifyAdmin, grantAdminAccess)
router.delete('/admin/revoke-access/:userId', verifyAdmin, revokeAdminAccess)

// Contact support management
router.get('/admin/contact-submissions', verifyAdmin, getContactSubmissions)
router.get('/admin/contact-submissions/:submissionId', verifyAdmin, getContactSubmissionDetails)
router.put('/admin/contact-submissions/:submissionId/status', verifyAdmin, updateContactSubmissionStatus)

export default router

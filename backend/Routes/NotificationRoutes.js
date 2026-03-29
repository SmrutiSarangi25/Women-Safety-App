import express from 'express'
import {
  sendSMSNotification,
  sendEmailNotification,
  sendWhatsAppNotification,
  sendEmergencySOS,
  getNotificationStats
} from '../Controllers/NotificationController.js'
import { verifyUser } from '../Middlewares/AdminAuth.js'

const router = express.Router()

// Send SMS notification
router.post('/sms', verifyUser, sendSMSNotification)

// Send Email notification
router.post('/email', verifyUser, sendEmailNotification)

// Send WhatsApp notification
router.post('/whatsapp', verifyUser, sendWhatsAppNotification)

// Send comprehensive emergency SOS
router.post('/emergency-sos', verifyUser, sendEmergencySOS)

// Get notification statistics
router.get('/stats', verifyUser, getNotificationStats)

export default router

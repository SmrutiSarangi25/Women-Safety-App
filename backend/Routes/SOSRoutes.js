import express from 'express'
import {
  sendSOSAlert,
  updateSOSStatus,
  getSOSHistory,
  getActiveSOSAlert
} from '../Controllers/SOSController.js'
import { verifyUser } from '../Middlewares/AdminAuth.js'
import { upload } from '../Middlewares/Multer.js'

const router = express.Router()

// Send SOS alert
router.post('/send', verifyUser, upload.single('evidenceAudio'), sendSOSAlert)

// Get active SOS alert
router.get('/active', verifyUser, getActiveSOSAlert)

// Get SOS history
router.get('/history', verifyUser, getSOSHistory)

// Update SOS status
router.put('/:sosId', verifyUser, updateSOSStatus)

export default router

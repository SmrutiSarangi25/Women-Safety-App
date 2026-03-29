import express from 'express'
import {
  shareLocation,
  getSharedLocation,
  getAllSharedLocations,
  stopSharing,
  getLocationHistory,
  getEmergencyContactLocations
} from '../Controllers/LocationController.js'
import { verifyUser } from '../Middlewares/AdminAuth.js'

const router = express.Router()

// Share location
router.post('/share', verifyUser, shareLocation)

// Stop sharing
router.post('/stop-sharing', verifyUser, stopSharing)

// Get all shared locations
router.get('/shared', verifyUser, getAllSharedLocations)

// Get emergency contact locations
router.get('/emergency-contacts', verifyUser, getEmergencyContactLocations)

// Get location history
router.get('/history', verifyUser, getLocationHistory)

// Get specific user's shared location
router.get('/:userId', verifyUser, getSharedLocation)

export default router

import express from 'express'
import {
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact,
  testNotification
} from '../Controllers/EmergencyContactController.js'
import { verifyUser } from '../Middlewares/AdminAuth.js'

const router = express.Router()

// Get all emergency contacts
router.get('/', verifyUser, getEmergencyContacts)

// Add new emergency contact
router.post('/', verifyUser, addEmergencyContact)

// Update emergency contact
router.put('/:contactId', verifyUser, updateEmergencyContact)

// Delete emergency contact
router.delete('/:contactId', verifyUser, deleteEmergencyContact)

// Test notification
router.post('/:contactId/test', verifyUser, testNotification)

export default router

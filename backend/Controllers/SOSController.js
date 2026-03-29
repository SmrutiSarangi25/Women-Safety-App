import SOS from '../Models/SOSModel.js'
import Location from '../Models/LocationModel.js'
import User from '../Models/UserModel.js'
import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import { cloudinaryUploadResource } from '../Utils/Cloudinary.js'

dotenv.config()

// Send SOS alert
export const sendSOSAlert = async (req, res) => {
  try {
    const {
      latitude,
      longitude,
      accuracy,
      severity = 'high',
      message,
      transcript = '',
      typedFallback = ''
    } = req.body
    const userId = req.user.id

    const parsedLatitude = latitude !== undefined ? Number(latitude) : undefined
    const parsedLongitude = longitude !== undefined ? Number(longitude) : undefined
    const parsedAccuracy = accuracy !== undefined ? Number(accuracy) : undefined

    let evidencePayload = null
    if (req.file?.path) {
      try {
        const uploadResult = await cloudinaryUploadResource(req.file.path, {
          folder: 'SOSEvidence',
          resourceType: 'video'
        })

        evidencePayload = {
          audioUrl: uploadResult.secureUrl,
          cloudinaryPublicId: uploadResult.publicId,
          mimeType: req.file.mimetype,
          transcript,
          typedFallback,
          uploadedAt: new Date()
        }
      } catch (uploadError) {
        console.error('Failed to upload SOS audio evidence:', uploadError)
      } finally {
        await fs.unlink(req.file.path).catch(() => {})
      }
    }

    // Create SOS record
    const sosAlert = new SOS({
      userId,
      location: {
        latitude: Number.isFinite(parsedLatitude) ? parsedLatitude : undefined,
        longitude: Number.isFinite(parsedLongitude) ? parsedLongitude : undefined,
        accuracy: Number.isFinite(parsedAccuracy) ? parsedAccuracy : undefined
      },
      severity,
      alertMessage: message || transcript || typedFallback || 'Emergency Alert! I need help!',
      evidence: evidencePayload,
      status: 'active'
    })

    await sosAlert.save()

    // Get user's emergency contacts
    const user = await User.findById(userId).populate('emergencyContacts')

    // Send notifications to emergency contacts
    if (user && user.emergencyContacts && user.emergencyContacts.length > 0) {
      await sendEmergencyNotifications(user, sosAlert)
    }

    // Log alert for admin
    console.log('SOS Alert sent:', {
      userId,
      location: { latitude, longitude },
      timestamp: new Date(),
      severity
    })

    res.status(201).json({
      success: true,
      message: 'SOS alert sent successfully',
      sosId: sosAlert._id
    })
  } catch (error) {
    console.error('Error sending SOS alert:', error)
    res.status(500).json({ success: false, message: 'Failed to send SOS alert', error: error.message })
  }
}

// Send notifications to emergency contacts
const sendEmergencyNotifications = async (user, sosAlert) => {
  try {
    const { latitude, longitude } = sosAlert.location
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`

    const contacts = user.emergencyContacts || []

    for (const contact of contacts) {
      const notificationData = {
        name: user.name,
        phone: user.phone,
        location: `https://www.google.com/maps?q=${latitude},${longitude}`,
        message: `EMERGENCY ALERT from ${user.name}! They need help at coordinates ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      }

      // Send SMS (if phone number available)
      if (contact.phone && contact.notificationMethod.includes('sms')) {
        await sendSMS(contact.phone, notificationData.message)
      }

      // Send Email (if email available)
      if (contact.email && contact.notificationMethod.includes('email')) {
        await sendEmailAlert(contact.email, user.name, notificationData)
      }

      // Send WhatsApp (if phone available)
      if (contact.phone && contact.notificationMethod.includes('whatsapp')) {
        await sendWhatsAppAlert(contact.phone, notificationData.message)
      }

      // Update contact notification status
      sosAlert.contacts.push({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        notificationMethod: contact.notificationMethod,
        notificationSent: true,
        sentAt: new Date()
      })
    }

    await sosAlert.save()
  } catch (error) {
    console.error('Error sending notifications:', error)
  }
}

// Send SMS notification (Twilio)
const sendSMS = async (phoneNumber, message) => {
  try {
    // TODO: Implement Twilio SMS
    // const twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    // await twilioClient.messages.create({
    //   body: message,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber
    // })
    console.log('SMS would be sent to:', phoneNumber)
  } catch (error) {
    console.error('Error sending SMS:', error)
  }
}

// Send Email alert
const sendEmailAlert = async (email, userName, data) => {
  try {
    // TODO: Implement Email
    console.log('Email alert would be sent to:', email)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

// Send WhatsApp alert (Twilio)
const sendWhatsAppAlert = async (phoneNumber, message) => {
  try {
    // TODO: Implement Twilio WhatsApp
    console.log('WhatsApp would be sent to:', phoneNumber)
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
  }
}

// Update SOS status
export const updateSOSStatus = async (req, res) => {
  try {
    const { sosId } = req.params
    const { status, notes } = req.body
    const userId = req.user.id

    const sos = await SOS.findById(sosId)

    if (!sos) {
      return res.status(404).json({ success: false, message: 'SOS alert not found' })
    }

    // User can only update their own SOS alerts
    if (sos.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Unauthorized' })
    }

    sos.status = status
    sos.notes = notes
    if (status === 'resolved') {
      sos.resolvedAt = new Date()
    }

    await sos.save()

    res.status(200).json({
      success: true,
      message: 'SOS status updated',
      sos
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update SOS status', error: error.message })
  }
}

// Get SOS history
export const getSOSHistory = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 10 } = req.query

    const alerts = await SOS.find({ userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await SOS.countDocuments({ userId })

    res.status(200).json({
      success: true,
      alerts,
      totalAlerts: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch SOS history', error: error.message })
  }
}

// Get active SOS alert
export const getActiveSOSAlert = async (req, res) => {
  try {
    const userId = req.user.id

    const activeAlert = await SOS.findOne({ userId, status: 'active' })

    if (!activeAlert) {
      return res.status(404).json({ success: false, message: 'No active SOS alert' })
    }

    res.status(200).json({
      success: true,
      alert: activeAlert
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch active alert', error: error.message })
  }
}

import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
})

// Send SMS notification (Twilio)
export const sendSMSNotification = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body

    // Validate phone number
    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required'
      })
    }

    // TODO: Implement Twilio SMS
    /*
    const twilioClient = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    })
    */

    console.log(`SMS would be sent to ${phoneNumber}: ${message}`)

    res.status(200).json({
      success: true,
      message: 'SMS notification sent successfully'
    })
  } catch (error) {
    console.error('Error sending SMS:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send SMS notification',
      error: error.message
    })
  }
}

// Send Email notification
export const sendEmailNotification = async (req, res) => {
  try {
    const { email, subject, htmlMessage, textMessage } = req.body

    // Validate required fields
    if (!email || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Email and subject are required'
      })
    }

    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@raksha.app',
      to: email,
      subject: subject,
      html: htmlMessage || textMessage,
      text: textMessage
    }

    await transporter.sendMail(mailOptions)

    res.status(200).json({
      success: true,
      message: 'Email notification sent successfully'
    })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send email notification',
      error: error.message
    })
  }
}

// Send WhatsApp notification (Twilio)
export const sendWhatsAppNotification = async (req, res) => {
  try {
    const { phoneNumber, message } = req.body

    // Validate phone number
    if (!phoneNumber || !message) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and message are required'
      })
    }

    // TODO: Implement Twilio WhatsApp
    /*
    const twilioClient = require('twilio')(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    await twilioClient.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phoneNumber}`
    })
    */

    console.log(`WhatsApp would be sent to ${phoneNumber}: ${message}`)

    res.status(200).json({
      success: true,
      message: 'WhatsApp notification sent successfully'
    })
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send WhatsApp notification',
      error: error.message
    })
  }
}

// Send emergency SOS to multiple contacts via different channels
export const sendEmergencySOS = async (req, res) => {
  try {
    const {
      contacts,
      latitude,
      longitude,
      userName,
      userPhone,
      emergencyMessage
    } = req.body

    if (!contacts || contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one contact is required'
      })
    }

    const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`
    const results = {
      success: [],
      failed: []
    }

    for (const contact of contacts) {
      try {
        // Send SMS
        if (contact.notificationMethods.includes('sms') && contact.phone) {
          await sendSMSAlert(contact.phone, userName, userPhone, locationUrl)
          results.success.push({
            contact: contact.name,
            method: 'sms'
          })
        }

        // Send Email
        if (contact.notificationMethods.includes('email') && contact.email) {
          await sendEmailAlert(contact.email, userName, userPhone, locationUrl)
          results.success.push({
            contact: contact.name,
            method: 'email'
          })
        }

        // Send WhatsApp
        if (contact.notificationMethods.includes('whatsapp') && contact.phone) {
          await sendWhatsAppSOS(contact.phone, userName, userPhone, locationUrl)
          results.success.push({
            contact: contact.name,
            method: 'whatsapp'
          })
        }
      } catch (error) {
        results.failed.push({
          contact: contact.name,
          error: error.message
        })
      }
    }

    res.status(200).json({
      success: true,
      message: 'Emergency SOS sent',
      results
    })
  } catch (error) {
    console.error('Error sending emergency SOS:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency SOS',
      error: error.message
    })
  }
}

// Helper function: Send SMS alert
const sendSMSAlert = async (phoneNumber, userName, userPhone, locationUrl) => {
  const message = `🚨 EMERGENCY ALERT from ${userName}! They need help immediately. Call: ${userPhone}. Location: ${locationUrl}`
  console.log(`SMS Alert to ${phoneNumber}: ${message}`)
  // TODO: Implement Twilio API call
}

// Helper function: Send Email alert
const sendEmailAlert = async (email, userName, userPhone, locationUrl) => {
  const htmlMessage = `
    <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f0f0f0;'>
      <div style='background-color: #ff4444; color: white; padding: 20px; text-align: center; border-radius: 5px;'>
        <h2 style='margin: 0;'>🚨 EMERGENCY ALERT 🚨</h2>
      </div>
      <div style='background-color: white; padding: 20px; margin-top: 20px; border-radius: 5px;'>
        <p><strong>${userName}</strong> needs help immediately!</p>
        <p><strong>Phone:</strong> ${userPhone}</p>
        <p><strong>Location:</strong> <a href='${locationUrl}'>Click here to view location</a></p>
        <p style='color: #666; font-size: 12px;'>This is an automated emergency alert from RAKSHA Women Safety App</p>
      </div>
    </div>
  `

  const textMessage = `EMERGENCY ALERT: ${userName} needs help! Contact: ${userPhone}. Location: ${locationUrl}`

  console.log(`Email Alert to ${email}`)
  // TODO: Send with nodemailer
}

// Helper function: Send WhatsApp alert
const sendWhatsAppSOS = async (phoneNumber, userName, userPhone, locationUrl) => {
  const message = `🚨 *EMERGENCY ALERT* from ${userName}!\nThey need help NOW!\nCall: ${userPhone}\nLocation: ${locationUrl}`
  console.log(`WhatsApp Alert to ${phoneNumber}: ${message}`)
  // TODO: Implement Twilio WhatsApp API call
}

// Get notification statistics
export const getNotificationStats = async (req, res) => {
  try {
    // TODO: Implement stats retrieval from database
    res.status(200).json({
      success: true,
      stats: {
        totalNotificationsSent: 0,
        smsSent: 0,
        emailsSent: 0,
        whatsappSent: 0,
        failedAttempts: 0
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics',
      error: error.message
    })
  }
}

import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import ContactSubmission from '../Models/ContactSubmissionModel.js'

dotenv.config()

const VALID_SUBJECTS = new Set(['general', 'support', 'partnership', 'feedback', 'emergency'])
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const INTERNATIONAL_PHONE_REGEX = /^\+?[1-9]\d{7,14}$/

const getSubjectCategory = (subject = '') => {
  const normalizedSubject = subject.toLowerCase().trim()
  return VALID_SUBJECTS.has(normalizedSubject) ? normalizedSubject : 'other'
}

const shouldBeHighPriority = (subjectCategory, message) => {
  if (subjectCategory === 'emergency') return true

  const emergencyKeywords = ['urgent', 'danger', 'threat', 'attack', 'harassment', 'help now', 'emergency']
  const normalizedMessage = message.toLowerCase()
  return emergencyKeywords.some((keyword) => normalizedMessage.includes(keyword))
}

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    return null
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
}

const sendEmailNotifications = async ({ name, email, phone, subject, message, attachmentFile }) => {
  const transporter = createTransporter()
  const adminRecipient = process.env.ADMIN_EMAIL || 'admin@raksha.app'

  if (!transporter) {
    return {
      adminNotified: false,
      userConfirmationSent: false,
      lastError: 'SMTP credentials are missing. Submission saved without email delivery.'
    }
  }

  const adminEmailContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p><em>This is an automated message from RAKSHA Women Safety App</em></p>
  `

  const attachments = attachmentFile
    ? [{ filename: attachmentFile.originalname, path: attachmentFile.path }]
    : []

  const adminMailOptions = {
    from: process.env.EMAIL_USER,
    to: adminRecipient,
    subject: `New Contact Form: ${subject}`,
    html: adminEmailContent,
    attachments
  }

  const userEmailContent = `
    <h2>Thank you for contacting RAKSHA</h2>
    <p>Hi ${name},</p>
    <p>We have received your message and will get back to you soon.</p>
    <hr>
    <p><strong>Your Message Details:</strong></p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong></p>
    <p>${message.replace(/\n/g, '<br>')}</p>
    <hr>
    <p>Best regards,<br><strong>RAKSHA Team</strong></p>
  `

  const userMailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'We received your message - RAKSHA',
    html: userEmailContent
  }

  const [adminResult, userResult] = await Promise.allSettled([
    transporter.sendMail(adminMailOptions),
    transporter.sendMail(userMailOptions)
  ])

  const errors = []
  if (adminResult.status === 'rejected') {
    errors.push(`Admin email failed: ${adminResult.reason?.message || 'unknown error'}`)
  }
  if (userResult.status === 'rejected') {
    errors.push(`User confirmation failed: ${userResult.reason?.message || 'unknown error'}`)
  }

  return {
    adminNotified: adminResult.status === 'fulfilled',
    userConfirmationSent: userResult.status === 'fulfilled',
    lastError: errors.join(' | ') || undefined
  }
}

export const submitContactForm = async (req, res) => {
  try {
    const name = req.body.name?.trim()
    const email = req.body.email?.toLowerCase().trim()
    const phone = req.body.phone?.replace(/[\s\-()]/g, '').trim()
    const subject = req.body.subject?.trim()
    const message = req.body.message?.trim()
    const attachmentFile = req.file
    const subjectCategory = getSubjectCategory(subject)
    const priority = shouldBeHighPriority(subjectCategory, message || '') ? 'high' : 'normal'

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      })
    }

    if (name.length < 3 || name.length > 60) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 3 and 60 characters.'
      })
    }

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    if (!INTERNATIONAL_PHONE_REGEX.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid international phone number.'
      })
    }

    if (message.length < 10 || message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 1000 characters.'
      })
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      subject,
      subjectCategory,
      message,
      priority,
      sourceIp: req.ip,
      userAgent: req.get('user-agent'),
      attachment: attachmentFile
        ? {
            originalName: attachmentFile.originalname,
            mimeType: attachmentFile.mimetype,
            size: attachmentFile.size,
            storagePath: attachmentFile.path
          }
        : undefined,
      emailDelivery: {
        attemptedAt: new Date(),
        adminNotified: false,
        userConfirmationSent: false
      }
    })

    const deliveryResult = await sendEmailNotifications({
      name,
      email,
      phone,
      subject,
      message,
      attachmentFile
    })

    submission.emailDelivery = {
      attemptedAt: new Date(),
      adminNotified: deliveryResult.adminNotified,
      userConfirmationSent: deliveryResult.userConfirmationSent,
      lastError: deliveryResult.lastError
    }
    await submission.save()

    console.log('Contact form submitted:', {
      submissionId: submission._id,
      priority,
      status: submission.status,
      subjectCategory
    })

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Our team will get back to you soon.',
      submissionId: submission._id,
      priority: submission.priority,
      emailDelivery: submission.emailDelivery
    })

  } catch (error) {
    console.error('Error submitting contact form:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: error.message
    })
  }
}

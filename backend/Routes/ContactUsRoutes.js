import express from 'express'
import { submitContactForm } from '../Controllers/ContactUsController.js'
import { upload } from '../Middlewares/Multer.js'
import { contactSubmissionRateLimit } from '../Middlewares/ContactRateLimit.js'

const router = express.Router()

// POST endpoint for contact form submission
router.post('/contact-us', contactSubmissionRateLimit, upload.single('attachment'), submitContactForm)

export default router

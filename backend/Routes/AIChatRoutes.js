import express from 'express'
import { chatWithAssistant, getAIAnalytics } from '../Controllers/AIChatController.js'
import { verifyAdmin } from '../Middlewares/AdminAuth.js'

const router = express.Router()

router.post('/chat', chatWithAssistant)
router.get('/analytics', verifyAdmin, getAIAnalytics)

export default router

const WINDOW_MS = 60 * 60 * 1000
const BURST_WINDOW_MS = 2 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5
const MAX_BURST_REQUESTS = 2

const requestStore = new Map()

const pruneEntries = (timestamps, windowMs, now) => timestamps.filter((time) => now - time < windowMs)

export const contactSubmissionRateLimit = (req, res, next) => {
  const now = Date.now()
  const emailKey = typeof req.body?.email === 'string' ? req.body.email.toLowerCase().trim() : 'unknown'
  const key = `${req.ip}:${emailKey}`

  const entry = requestStore.get(key) || { timestamps: [] }

  const windowRequests = pruneEntries(entry.timestamps, WINDOW_MS, now)
  const burstRequests = pruneEntries(windowRequests, BURST_WINDOW_MS, now)

  if (windowRequests.length >= MAX_REQUESTS_PER_WINDOW || burstRequests.length >= MAX_BURST_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many contact requests. Please wait a few minutes and try again.'
    })
  }

  windowRequests.push(now)
  requestStore.set(key, { timestamps: windowRequests })

  next()
}

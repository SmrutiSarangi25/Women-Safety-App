import Location from '../Models/LocationModel.js'
import User from '../Models/UserModel.js'

// Share current location
export const shareLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy, speed, heading, address, contacts, duration } = req.body
    const userId = req.user.id

    // Create location record
    const location = new Location({
      userId,
      latitude,
      longitude,
      accuracy,
      speed,
      heading,
      address,
      sharedWith: contacts || [],
      isSharing: true,
      sharingExpiresAt: new Date(Date.now() + duration * 60 * 1000)
    })

    await location.save()

    // Notify shared contacts
    if (contacts && contacts.length > 0) {
      await notifySharedContacts(userId, location)
    }

    res.status(201).json({
      success: true,
      message: 'Location shared successfully',
      location
    })
  } catch (error) {
    console.error('Error sharing location:', error)
    res.status(500).json({ success: false, message: 'Failed to share location', error: error.message })
  }
}

// Get shared location for a user
export const getSharedLocation = async (req, res) => {
  try {
    const { userId } = req.params
    const requestingUserId = req.user.id

    // Check if user has permission to view location
    const location = await Location.findOne({
      userId,
      sharedWith: requestingUserId,
      isSharing: true,
      sharingExpiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 })

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not available' })
    }

    res.status(200).json({
      success: true,
      location
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch location', error: error.message })
  }
}

// Get all shared locations for current user
export const getAllSharedLocations = async (req, res) => {
  try {
    const userId = req.user.id

    const locations = await Location.find({
      sharedWith: userId,
      isSharing: true,
      sharingExpiresAt: { $gt: new Date() }
    })
      .populate('userId', 'name phone email profileImage')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      locations
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch locations', error: error.message })
  }
}

// Stop sharing location
export const stopSharing = async (req, res) => {
  try {
    const userId = req.user.id

    await Location.updateMany(
      { userId, isSharing: true },
      { isSharing: false, sharingExpiresAt: new Date() }
    )

    res.status(200).json({
      success: true,
      message: 'Location sharing stopped'
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to stop sharing', error: error.message })
  }
}

// Get user's location history
export const getLocationHistory = async (req, res) => {
  try {
    const userId = req.user.id
    const { page = 1, limit = 20, hours = 24 } = req.query

    const since = new Date(Date.now() - hours * 60 * 60 * 1000)

    const locations = await Location.find({
      userId,
      createdAt: { $gte: since }
    })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const total = await Location.countDocuments({
      userId,
      createdAt: { $gte: since }
    })

    res.status(200).json({
      success: true,
      locations,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch location history', error: error.message })
  }
}

// Notify shared contacts about location update
const notifySharedContacts = async (userId, location) => {
  try {
    // TODO: Send notifications to shared contacts
    // This could be via WebSocket, SMS, Email, Push notifications, etc.
    console.log('Notifying shared contacts about location update')
  } catch (error) {
    console.error('Error notifying contacts:', error)
  }
}

// Get emergency contact locations
export const getEmergencyContactLocations = async (req, res) => {
  try {
    const userId = req.user.id

    // Get user's emergency contacts
    const user = await User.findById(userId).populate('emergencyContacts')

    if (!user || !user.emergencyContacts) {
      return res.status(200).json({ success: true, locations: [] })
    }

    // Get locations of emergency contacts if they're sharing
    const contactIds = user.emergencyContacts.map(c => c.userId || c._id)

    const locations = await Location.find({
      userId: { $in: contactIds },
      sharedWith: userId,
      isSharing: true,
      sharingExpiresAt: { $gt: new Date() }
    })
      .populate('userId', 'name phone email profileImage')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      locations
    })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch contact locations', error: error.message })
  }
}

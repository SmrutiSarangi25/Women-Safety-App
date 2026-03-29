import User from '../Models/UserModel.js'

// Add emergency contact
export const addEmergencyContact = async (req, res) => {
  try {
    const { name, phone, email, notificationMethods } = req.body
    const userId = req.user.id

    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required'
      })
    }

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Initialize emergencyContacts if it doesn't exist
    if (!user.emergencyContacts) {
      user.emergencyContacts = []
    }

    // Check for duplicates
    const exists = user.emergencyContacts.some(c => c.phone === phone)
    if (exists) {
      return res.status(400).json({ success: false, message: 'Contact already exists' })
    }

    // Add new contact
    user.emergencyContacts.push({
      name,
      phone,
      email: email || '',
      notificationMethods: notificationMethods || ['sms']
    })

    await user.save()

    res.status(201).json({
      success: true,
      message: 'Emergency contact added successfully',
      contact: user.emergencyContacts[user.emergencyContacts.length - 1]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add emergency contact',
      error: error.message
    })
  }
}

// Get emergency contacts
export const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.status(200).json({
      success: true,
      contacts: user.emergencyContacts || []
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency contacts',
      error: error.message
    })
  }
}

// Update emergency contact
export const updateEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params
    const { name, phone, email, notificationMethods } = req.body
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const contact = user.emergencyContacts.id(contactId)

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' })
    }

    if (name) contact.name = name
    if (phone) contact.phone = phone
    if (email) contact.email = email
    if (notificationMethods) contact.notificationMethods = notificationMethods

    await user.save()

    res.status(200).json({
      success: true,
      message: 'Emergency contact updated',
      contact
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update emergency contact',
      error: error.message
    })
  }
}

// Delete emergency contact
export const deleteEmergencyContact = async (req, res) => {
  try {
    const { contactId } = req.params
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    user.emergencyContacts.id(contactId).deleteOne()
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Emergency contact deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete emergency contact',
      error: error.message
    })
  }
}

// Test emergency contact notification
export const testNotification = async (req, res) => {
  try {
    const { contactId, method } = req.body
    const userId = req.user.id

    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const contact = user.emergencyContacts.id(contactId)

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' })
    }

    // TODO: Send test notification based on method (sms, email, whatsapp)
    console.log(`Test ${method} sent to ${contact.name}`)

    res.status(200).json({
      success: true,
      message: `Test notification sent via ${method}`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message
    })
  }
}

import jwt from 'jsonwebtoken'
import Admin from '../Models/AdminModel.js'

export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    
    // Check if user is admin
    const admin = await Admin.findOne({ userId: decoded.id, isActive: true })

    if (!admin) {
      return res.status(403).json({ message: 'Admin access required' })
    }

    req.admin = admin
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message })
  }
}

export const checkPermission = (requiredPermissions = []) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const hasPermission = requiredPermissions.every(permission =>
      req.admin.permissions[permission] === true
    )

    if (!hasPermission) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }

    next()
  }
}

export const verifyUser = (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message })
  }
}

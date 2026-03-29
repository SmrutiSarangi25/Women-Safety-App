import React from 'react'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'

function AdminProtectedRoute({ children }) {
  const { auth, isAdmin, loading } = useContext(AuthContext)

  if (loading) {
    return null
  }

  if (!auth) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/HomePage" replace />
  }

  return children
}

export default AdminProtectedRoute

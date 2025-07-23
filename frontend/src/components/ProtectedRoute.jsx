import React from 'react'
import { Navigate } from 'react-router-dom'
import useUser from '../hooks/useUser'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser()

  if (loading) return <div>Loading...</div>

  return user ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute

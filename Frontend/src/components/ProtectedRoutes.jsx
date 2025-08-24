import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center py-10">Loading...</div>
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

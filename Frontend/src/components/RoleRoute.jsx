import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RoleRoute({ allow = [] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  
  return allow.includes(user.role) ? <Outlet /> : <Navigate to="/login" replace />
}

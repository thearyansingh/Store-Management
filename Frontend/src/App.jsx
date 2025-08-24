import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsers from './pages/AdminUsers'
import AdminStores from './pages/AdminStores'
import OwnerDashboard from './pages/OwnerDashboard'
import ProtectedRoute from './components/ProtectedRoutes'
import RoleRoute from './components/RoleRoute'
import Profile from './pages/Profile'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      
           <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          {/* <Route path="/" element={<Navigate to="/login" />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<UserDashboard />} />
          </Route>

          {/* admin */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allow={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/stores" element={<AdminStores />} />
            </Route>
          </Route>

          {/* owner */}
          <Route element={<ProtectedRoute />}>
            <Route element={<RoleRoute allow={['owner']} />}>
              <Route path="/owner" element={<OwnerDashboard />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </div>
  )
}

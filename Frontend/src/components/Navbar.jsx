import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Store Ratings</Link>
        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
          {user && (
            <>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin" className="text-sm">Admin</Link>
                  <Link to="/admin/users" className="text-sm">Users</Link>
                  <Link to="/admin/stores" className="text-sm">Stores</Link>
                </>
              )}
              {user.role === 'owner' && <Link to="/owner" className="text-sm">Owner</Link>}
              {user.role === 'user' && <Link to="/user" className="text-sm">Stores</Link>}
              <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('Admin@1234')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const u = await login(email, password)
      if (u.role === 'admin') nav('/admin')
      else if (u.role === 'owner') nav('/owner')
      else nav('/user')
    } catch (e) {
      setErr(e?.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input className="border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="border rounded p-2" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button disabled={loading} className="bg-blue-600 text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="mt-3 text-sm">No account? <Link className="text-blue-600" to="/register">Register</Link></div>
    </div>
  )
}

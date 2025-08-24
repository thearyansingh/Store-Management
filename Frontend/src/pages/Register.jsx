import { useState } from 'react'
import { register as apiRegister } from '../api/authApi'
import { useNavigate, Link } from 'react-router-dom'

export default function Register() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' })
  const [err, setErr] = useState(''); const [ok, setOk] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr(''); setOk('')
    try {
      await apiRegister(form)
      setOk('Registered! You can now login.')
      setTimeout(()=> nav('/login'), 700)
    } catch (e) {
      setErr(e?.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Register (User)</h1>
      {err && <div className="mb-3 text-red-600 text-sm">{err}</div>}
      {ok && <div className="mb-3 text-green-600 text-sm">{ok}</div>}
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input name="name" className="border rounded p-2" placeholder="Full name (20-60 chars)" value={form.name} onChange={onChange} />
        <input name="email" className="border rounded p-2" placeholder="Email" value={form.email} onChange={onChange} />
        <input name="address" className="border rounded p-2" placeholder="Address" value={form.address} onChange={onChange} />
        <input name="password" type="password" className="border rounded p-2" placeholder="Password" value={form.password} onChange={onChange} />
        <button className="bg-blue-600 text-white py-2 rounded">Register</button>
      </form>
      <div className="mt-3 text-sm">Have an account? <Link className="text-blue-600" to="/login">Login</Link></div>
    </div>
  )
}

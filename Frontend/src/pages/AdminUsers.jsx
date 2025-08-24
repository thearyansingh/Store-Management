import { useEffect, useState } from 'react'
import { listUsers, createUser } from '../api/adminApi'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState({ name: '', email: '', address: '', role: '' })
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', role: 'user' })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await listUsers(q)
      setUsers(data.data || data.rows || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const onCreate = async (e) => {
    e.preventDefault(); setErr('')
    try {
      await createUser(form)
      setForm({ name: '', email: '', password: '', address: '', role: 'user' })
      await load()
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to create user')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Manage Users</h1>

      <div className="bg-white rounded p-4 shadow">
        <div className="mb-3 font-medium">Filters</div>
        <div className="grid md:grid-cols-4 gap-2">
          <input className="border rounded p-2" placeholder="Name" value={q.name} onChange={e=>setQ({...q, name: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Email" value={q.email} onChange={e=>setQ({...q, email: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Address" value={q.address} onChange={e=>setQ({...q, address: e.target.value})}/>
          <select className="border rounded p-2" value={q.role} onChange={e=>setQ({...q, role: e.target.value})}>
            <option value="">Any role</option>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
        </div>
        <button onClick={load} className="mt-3 bg-gray-800 text-white px-4 py-2 rounded">Apply</button>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <div className="mb-3 font-medium">Create User</div>
        {err && <div className="text-red-600 text-sm mb-2">{err}</div>}
        <form onSubmit={onCreate} className="grid md:grid-cols-5 gap-2">
          <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address: e.target.value})}/>
          <input type="password" className="border rounded p-2" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})}/>
          <select className="border rounded p-2" value={form.role} onChange={e=>setForm({...form, role: e.target.value})}>
            <option value="user">user</option>
            <option value="admin">admin</option>
            <option value="owner">owner</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-5">Create</button>
        </form>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <div className="mb-3 font-medium">Users</div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th><th>Email</th><th>Address</th><th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u=>(
                <tr key={u.id} className="border-b">
                  <td className="py-2">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.address}</td>
                  <td>{u.role}</td>
                </tr>
              ))}
              {users.length===0 && <tr><td className="py-3 text-gray-500">No users</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

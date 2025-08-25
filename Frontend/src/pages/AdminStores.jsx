import { useEffect, useState } from 'react'
import { listStores, createStore, listUsers } from '../api/adminApi' // <-- make sure listUsers exists

export default function AdminStores() {
  const [stores, setStores] = useState([])
  const [owners, setOwners] = useState([]) // 
  const [q, setQ] = useState({ name: '', email: '', address: '' })
  const [form, setForm] = useState({ name: '', email: '', address: '', owner_id: '' })

  const load = async () => {
    const { data } = await listStores(q)
    setStores(data.data || data.rows || [])
  }

  const loadOwners = async () => {
    const { data } = await listUsers() // API should return all users
// console.log(data)
    const onlyOwners = data?.data?.filter(u => u.role === 'owner')
    // console.log(onlyOwners)
    setOwners(onlyOwners)
  }
//   console.log(owners)   

  useEffect(() => {
    load()
    loadOwners()
  }, [])

  const onCreate = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (!payload.owner_id) delete payload.owner_id
    await createStore(payload)
    setForm({ name: '', email: '', address: '', owner_id: '' })
    await load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Manage Stores</h1>

      <div className="bg-white rounded p-4 shadow">
        <div className="mb-3 font-medium">Filters</div>
        <div className="grid md:grid-cols-3 gap-2">
          <input className="border rounded p-2" placeholder="Name" value={q.name} onChange={e=>setQ({...q, name: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Email" value={q.email} onChange={e=>setQ({...q, email: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Address" value={q.address} onChange={e=>setQ({...q, address: e.target.value})}/>
        </div>
        <button onClick={load} className="mt-3 bg-gray-800 text-white px-4 py-2 rounded">Apply</button>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <div className="mb-3 font-medium">Create Store</div>
        <form onSubmit={onCreate} className="grid md:grid-cols-4 gap-2">
          <input className="border rounded p-2" placeholder="Name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})}/>
          <input className="border rounded p-2" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address: e.target.value})}/>
          
          {/* Dropdown for owners */}
          <select
            className="border rounded p-2"
            value={form.owner_id}
            onChange={e => setForm({...form, owner_id: e.target.value})}
          >
            <option value="">Select Owner (optional)</option>
            {owners.map(o => (
              <option key={o.id} value={o.id}>{o.name || o.email}</option>
            ))}
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded md:col-span-4">Create</button>
        </form>
      </div>

      <div className="bg-white rounded p-4 shadow">
        <div className="mb-3 font-medium">Stores</div>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th><th>Email</th><th>Address</th><th>Avg Rating</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(s=>(
                <tr key={s.id} className="border-b">
                  <td className="py-2">{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.address}</td>
                  <td>{s.average_rating ?? s.overall_rating ?? 0}</td>
                
                </tr>
              ))}
              {stores.length===0 && <tr><td className="py-3 text-gray-500">No stores</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

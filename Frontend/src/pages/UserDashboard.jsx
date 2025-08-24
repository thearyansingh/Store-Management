import { useEffect, useState } from 'react'
import { listPublicStores, rateStore } from '../api/storeApi'
import { useAuth } from '../context/AuthContext'
import StoreCard from '../components/StoreCard'
import EmptyState from '../components/EmptyState'

export default function UserDashboard() {
  const { user } = useAuth()
  const [q, setQ] = useState({ name: '', address: '' })
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const params = { ...q }
      if (user?.id) params.userId = user.id
      const { data } = await listPublicStores(params)
      setStores(data.data || data) // depending on your controller shape
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, []) // initial

  const onRate = async (storeId, rating) => {
    await rateStore(storeId, rating)
    await load()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Stores</h1>
      <div className="flex gap-2">
        <input className="border rounded p-2 flex-1" placeholder="Search by name" value={q.name} onChange={e=>setQ({...q, name: e.target.value})}/>
        <input className="border rounded p-2 flex-1" placeholder="Search by address" value={q.address} onChange={e=>setQ({...q, address: e.target.value})}/>
        <button onClick={load} className="bg-gray-800 text-white px-4 rounded">Search</button>
      </div>

      {loading && <div>Loading...</div>}
      {!loading && stores.length === 0 && <EmptyState title="No stores found" />}

      <div className="grid md:grid-cols-2 gap-4">
        {stores.map(s => (
          <StoreCard key={s.id} store={s} onRate={onRate} />
        ))}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getDashboard } from '../api/adminApi'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 })

  useEffect(() => {
    (async () => {
      const { data } = await getDashboard()
      setStats(data)
      
    })()
  }, [])


  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <Card title="Users" value={stats.totalUsers} />
        <Card title="Stores" value={stats.totalStores} />
        <Card title="Ratings" value={stats.totalRatings} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-5">
      <div className="text-gray-500">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getOwnerStores, getOwnerRatings } from '../api/ownerApi'

export default function OwnerDashboard() {
  const [stores, setStores] = useState([])
  const [selectedStore, setSelectedStore] = useState(null)
  const [ratings, setRatings] = useState([])
  const [loadingRatings, setLoadingRatings] = useState(false)

  // Fetch owner stores on mount
  useEffect(() => {
    (async () => {
      const { data } = await getOwnerStores()
      // your API returns array directly, so use data
      setStores(data || [])
    })()
  }, [])

  const loadRatings = async (store) => {
    setSelectedStore(store)
    setLoadingRatings(true)
    try {
      const { data } = await getOwnerRatings(store.id)
      setRatings(data?.raters || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingRatings(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Owner Dashboard</h1>

      {/* Store cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {stores.map((store) => (
          <div
            key={store.id}
            onClick={() => loadRatings(store)}
            className="cursor-pointer border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            <div className="font-semibold text-lg">{store.name}</div>
            <div className="text-sm text-gray-600">{store.email}</div>
            <div className="text-sm text-gray-600">{store.address}</div>
            <div className="text-sm mt-2">Avg Rating: {store.average_rating ?? 0}</div>
          </div>
        ))}
        {stores.length === 0 && (
          <div className="text-gray-500">No stores found</div>
        )}
      </div>

      {/* Ratings table */}
      {selectedStore && (
        <div className="bg-white rounded p-4 shadow">
          <h2 className="font-medium mb-3">
            Ratings for: {selectedStore.name}
          </h2>

          {loadingRatings ? (
            <div>Loading ratings...</div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">User</th>
                    <th>Email</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {ratings.map((r) => (
                    <tr key={r.id} className="border-b">
                      <td className="py-2">{r.user?.name}</td>
                      <td>{r.user?.email}</td>
                      <td>{r.rating}</td>
                    </tr>
                  ))}
                  {ratings.length === 0 && (
                    <tr>
                      <td className="py-3 text-gray-500" colSpan={3}>
                        No ratings yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

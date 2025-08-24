import RatingStars from './RatingsStars'

export default function StoreCard({ store, onRate }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{store.name}</h3>
        <span className="text-sm text-gray-500">Avg: {store.overall_rating ?? 0}</span>
      </div>
      <div className="text-sm text-gray-600">{store.address}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm">Your rating:</span>
        <RatingStars value={store.my_rating || 0} onChange={(v)=>onRate(store.id, v)} />
      </div>
    </div>
  )
}

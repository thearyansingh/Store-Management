export default function RatingStars({ value = 0, onChange, readOnly = false }) {
  const stars = [1,2,3,4,5]
  return (
    <div className="flex gap-1">
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          onClick={() => onChange && onChange(s)}
          className={'text-xl ' + (s <= value ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400')}
          aria-label={`Rate ${s}`}
        >★</button>
      ))}
    </div>
  )
}

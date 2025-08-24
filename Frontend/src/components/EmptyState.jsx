export default function EmptyState({ title = 'Nothing here', subtitle }) {
  return (
    <div className="text-center text-gray-500 py-10">
      <div className="font-medium">{title}</div>
      {subtitle && <div className="text-sm">{subtitle}</div>}
    </div>
  )
}

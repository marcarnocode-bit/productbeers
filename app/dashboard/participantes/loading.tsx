export default function ParticipantesLoading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-64 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Filters skeleton */}
      <div className="flex gap-4">
        <div className="w-64 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
        <div className="w-28 h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Participants grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-2 mt-4">
              <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

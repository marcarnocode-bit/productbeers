export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-96" />
        </div>
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
      </div>

      {/* Filters skeleton */}
      <div className="border-2 border-gray-300 shadow-md bg-white rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="w-full md:w-48">
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Events skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border-2 border-gray-300 shadow-md bg-white rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-4" />
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

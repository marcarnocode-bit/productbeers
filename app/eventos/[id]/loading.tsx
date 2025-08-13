export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button skeleton */}
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />

          {/* Event header skeleton */}
          <div className="space-y-4">
            <div className="w-3/4 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="flex items-center gap-4">
              <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-28 h-6 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Event image skeleton */}
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg animate-pulse" />

          {/* Event details skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Registration card skeleton */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

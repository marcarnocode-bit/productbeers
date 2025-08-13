export default function ResourceDetailLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button skeleton */}
          <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />

          {/* Resource header skeleton */}
          <div className="space-y-4">
            <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
            <div className="w-3/4 h-10 bg-gray-200 rounded animate-pulse" />
            <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Resource image skeleton */}
          <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg animate-pulse" />

          {/* Resource content skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-4">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

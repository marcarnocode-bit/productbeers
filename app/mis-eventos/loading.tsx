export default function MisEventosLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <div className="w-64 h-10 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="w-96 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>

          {/* Tabs skeleton */}
          <div className="flex justify-center">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Events grid skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-48 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="space-y-2">
                    <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="w-24 h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

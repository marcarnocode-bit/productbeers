export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header skeleton */}
      <div className="sticky top-0 z-40 w-full bg-white border-b border-gray-200">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gray-200 rounded-md animate-pulse" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-18 h-4 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-9 bg-gray-200 rounded animate-pulse" />
            <div className="w-28 h-9 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero section skeleton */}
          <div className="text-center space-y-4">
            <div className="w-3/4 h-12 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="flex justify-center gap-4 mt-6">
              <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
              <div className="w-28 h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Content cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                <div className="w-full h-48 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

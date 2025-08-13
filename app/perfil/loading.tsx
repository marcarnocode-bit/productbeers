export default function PerfilLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse mx-auto" />
            <div className="w-48 h-8 bg-gray-200 rounded animate-pulse mx-auto" />
            <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mx-auto" />
          </div>

          {/* Profile form skeleton */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
            <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-full h-24 bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Welcome Header skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="w-80 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-96 h-5 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="w-32 h-10 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Stats Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border-2 border-gray-300 shadow-md bg-white rounded-lg p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events skeleton */}
      <div className="border-2 border-gray-300 shadow-md bg-white rounded-lg">
        <div className="p-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="w-40 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-48 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="px-6 pb-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-4">
                  <div className="w-32 h-3 bg-gray-200 rounded animate-pulse" />
                  <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

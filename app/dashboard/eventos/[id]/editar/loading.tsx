export default function EditarEventoLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 bg-gray-200 rounded animate-pulse w-32 mb-4" />

        <div className="h-8 bg-gray-200 rounded animate-pulse w-64 mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-96 mb-8" />

        <div className="bg-white rounded-lg border shadow-sm">
          <div className="p-6 border-b">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48" />
          </div>
          <div className="p-6 space-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}

            <div className="flex justify-between pt-6">
              <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
              <div className="flex gap-2">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-20" />
                <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

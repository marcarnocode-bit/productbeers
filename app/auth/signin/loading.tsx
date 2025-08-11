export default function SignInLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-white">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-32 mb-2" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-64 mb-6" />

        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-1" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20 mb-1" />
            <div className="h-10 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      </div>
    </div>
  )
}

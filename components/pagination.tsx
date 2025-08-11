import Link from "next/link"
import { cn } from "@/lib/utils"

type PaginationProps = {
  total: number
  page: number
  pageSize: number
  basePath: string
  searchParams?: Record<string, string | number | undefined>
  className?: string
}

function buildHref(basePath: string, params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      qs.set(key, String(value))
    }
  })
  const query = qs.toString()
  return query ? `${basePath}?${query}` : basePath
}

function getPages(current: number, totalPages: number): (number | "...")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | "...")[] = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(totalPages - 1, current + 1)
  if (start > 2) pages.push("...")
  for (let i = start; i <= end; i++) pages.push(i)
  if (end < totalPages - 1) pages.push("...")
  pages.push(totalPages)
  return pages
}

export function Pagination({ total, page, pageSize, basePath, searchParams = {}, className }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  if (totalPages <= 1) return null

  const prevHref = buildHref(basePath, { ...searchParams, page: Math.max(1, page - 1), pageSize })
  const nextHref = buildHref(basePath, { ...searchParams, page: Math.min(totalPages, page + 1), pageSize })

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Paginación">
      <Link
        href={prevHref}
        aria-disabled={page === 1}
        className={cn(
          "px-3 py-2 rounded-md border text-sm",
          page === 1
            ? "pointer-events-none opacity-50 border-gray-200 text-gray-400"
            : "border-gray-300 hover:bg-gray-100",
        )}
      >
        Anterior
      </Link>

      {getPages(page, totalPages).map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 select-none">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(basePath, { ...searchParams, page: p, pageSize })}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              "px-3 py-2 rounded-md border text-sm",
              p === page
                ? "border-brand-primary bg-brand-primary text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-100",
            )}
          >
            {p}
          </Link>
        ),
      )}

      <Link
        href={nextHref}
        aria-disabled={page === totalPages}
        className={cn(
          "px-3 py-2 rounded-md border text-sm",
          page === totalPages
            ? "pointer-events-none opacity-50 border-gray-200 text-gray-400"
            : "border-gray-300 hover:bg-gray-100",
        )}
      >
        Siguiente
      </Link>
    </nav>
  )
}

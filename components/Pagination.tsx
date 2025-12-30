interface PaginationProps {
  totalPages: number
  currentPage: number
  startIndex: number
  endIndex: number
  filteredLength: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
}

export default function Pagination({
  totalPages,
  currentPage,
  startIndex,
  endIndex,
  filteredLength,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
}: PaginationProps) {
  if (filteredLength === 0) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="flex items-center gap-3 text-sm text-slate-600">
        <label className="flex items-center gap-2">
          <span>Afficher</span>
          <select
            value={pageSize}
            onChange={e => onPageSizeChange?.(Number(e.target.value))}
            className="rounded-md border bg-white px-2 py-1 text-sm"
          >
            {[10, 50, 100, 500].map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>par page — sur {filteredLength} résultats</span>
        </label>
      </div>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed bg-[#1E4F9B] hover:bg-[#1a4587]"
          >
            Précédent
          </button>

          <select
            value={currentPage}
            onChange={e => onPageChange(Number(e.target.value))}
            className="rounded-md border bg-white px-3 py-2 text-sm font-semibold text-slate-800"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>

          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed bg-[#1E4F9B] hover:bg-[#1a4587]"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

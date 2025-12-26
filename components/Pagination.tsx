interface PaginationProps {
  totalPages: number
  currentPage: number
  startIndex: number
  endIndex: number
  filteredLength: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  totalPages,
  currentPage,
  startIndex,
  endIndex,
  filteredLength,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-6 flex items-center justify-between">
      <div className="text-sm text-slate-600">
        Affichage {startIndex + 1} à {Math.min(endIndex, filteredLength)} sur {filteredLength} résultats
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed bg-[#1E4F9B] hover:bg-[#1a4587]"
        >
          Précédent
        </button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-[#1E4F9B] text-white"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed bg-[#1E4F9B] hover:bg-[#1a4587]"
        >
          Suivant
        </button>
      </div>
    </div>
  )
}

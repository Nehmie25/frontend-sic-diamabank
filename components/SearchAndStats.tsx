import { HiOutlineDownload } from "react-icons/hi"
import DatePicker from "react-datepicker"
import { fr } from "date-fns/locale"

interface SearchAndStatsProps {
  selectedDate: Date | null
  isLoading: boolean
  statistics: {
    total: number
    enAttente: number
    rejetees: number
    validees: number
  }
  personnesCount: number
  onDateChange: (date: Date | null) => void
  onSearch: () => void
  onExport: () => void
}

export default function SearchAndStats({
  selectedDate,
  isLoading,
  statistics,
  personnesCount,
  onDateChange,
  onSearch,
  onExport,
}: SearchAndStatsProps) {
  return (
    <div className="mb-6 rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-t border-slate-200 px-6 py-6 bg-slate-50">
        <div className="flex items-center justify-center">
          <div className="w-6/12 flex gap-4 items-center">
            <div className="flex-1">
              <DatePicker
                selected={selectedDate}
                onChange={onDateChange}
                dateFormat="dd/MM/yyyy"
                locale={fr}
                placeholderText="Sélectionner une date"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={onSearch}
              disabled={isLoading}
              className={`rounded-md px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors ${
                isLoading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-[#1E4F9B] hover:bg-[#1a4587]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Recherche en cours...
                </span>
              ) : (
                "Rechercher"
              )}
            </button>
          </div>
        </div>

        {/* 4 Statistics Cards */}
        <div className="mt-6 grid grid-cols-4 gap-4">
          <div className="rounded-md border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{statistics.total}</div>
            <div className="mt-2 text-sm text-slate-600">Total déclarations</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-orange-600">{statistics.enAttente}</div>
            <div className="mt-2 text-sm text-slate-600">En attente de correction</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-red-600">{statistics.rejetees}</div>
            <div className="mt-2 text-sm text-slate-600">Rejetées</div>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-4 text-center shadow-sm">
            <div className="text-3xl font-bold text-green-600">{statistics.validees}</div>
            <div className="mt-2 text-sm text-slate-600">Validées</div>
          </div>
        </div>

        {/* Export Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onExport}
            disabled={personnesCount < 1}
            className={`rounded-md px-8 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-colors flex items-center gap-2 ${
              personnesCount > 0
                ? "bg-[#1E4F9B] text-white hover:bg-[#1a4587] cursor-pointer"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }`}
          >
            <HiOutlineDownload size={18} />
            Exporter le fichier
          </button>
        </div>
      </div>
    </div>
  )
}

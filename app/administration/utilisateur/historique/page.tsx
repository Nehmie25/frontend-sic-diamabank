'use client'

import { use, useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { HiOutlineSearch } from "react-icons/hi"
import { IoCheckmarkCircle, IoChevronDown, IoClose, IoCloseCircle } from "react-icons/io5"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"




type History = {
  id: number
  operation: string
  userid: number,
  user_name: string
  date: string
  time: string
}

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (timeString: string): string => {
  if (!timeString) return '';
  try {
    const date = new Date(timeString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  } catch {
    return timeString;
  }
};

const HistoryPage = () => {
  
  const router = useRouter()
  const [history, setHistory] = useState<History[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/history?page=${currentPage}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })
        const data = await response.json()
        setHistory(data.Data || [])
        setTotalPages(data.Pagination.total_pages || 1)
      } catch (error) {
        console.error("Erreur lors de la récupération des historiques :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [currentPage])

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [search, setSearch] = useState("")

  const filteredHistory = history.filter((history) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return [history.user_name, history.operation, history.date].some((value) =>
      value.toLowerCase().includes(query)
    )
  })

  
  if (!token) {
    router.push("/connexion");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800">
      <aside className="fixed left-0 top-0 h-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <main className="flex min-h-screen flex-col transition-all duration-200 md:ml-72">
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton theme="light" />

        <div className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-[#eef2f6] px-4 py-3 sm:gap-6 sm:px-6">
              <h1 className="text-base font-semibold text-[#1f3c6d]">Liste des utilisateurs</h1>

              <div className="flex flex-1 justify-center">
                <div className="relative w-full max-w-xl">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher"
                    className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 pr-10 text-sm text-slate-700 shadow-inner outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                  <HiOutlineSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
              </div>

            </div>

            <div className="overflow-x-auto px-4 py-4 sm:px-6 sm:py-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-[#1E4F9B]"></div>
                    <p className="text-slate-600">Chargement en cours...</p>
                  </div>
                </div>
              ) : (
              <table className="min-w-full border border-slate-200 text-sm">
                <thead className="bg-[#f3f6fb] text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="w-14 border border-slate-200 px-3 py-2 text-center">N°</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Nom</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Operation</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((history, idx) => (
                    <tr key={history.id} className={`${idx % 2 === 0 ? "bg-[#f5f7fb]" : "bg-white"} text-slate-700`}>
                      <td className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800">{history.id}</td>
                      <td className="border border-slate-200 px-3 py-2">{history.user_name}</td>
                      <td className="border border-slate-200 px-3 py-2">{history.operation}</td>
                      <td className="border border-slate-200 px-3 py-2">{formatDate(history.date)} {formatTime(history.time)}</td>
                    </tr>
                  ))}

                  {!filteredHistory.length ? (
                    <tr>
                      <td className="px-3 py-4 text-center text-slate-500" colSpan={8}>
                        Aucun utilisateur ne correspond à votre recherche.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#eef2f6] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B] hover:bg-[#e6edf9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border shadow-sm ${
                      currentPage === page
                        ? 'border-[#1E4F9B] bg-[#1E4F9B] text-white'
                        : 'border-slate-300 bg-white text-[#1E4F9B] hover:border-[#1E4F9B] hover:bg-[#e6edf9]'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B] hover:bg-[#e6edf9] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &gt;
                </button>
              </div>

              <div className="text-sm text-slate-700">
                <span>Page {currentPage} sur {totalPages}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HistoryPage

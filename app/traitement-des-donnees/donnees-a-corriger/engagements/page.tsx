'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"

type Engagement = {
  id: number
  reference: string
  client: string
  montant: string
  statut: string
  echeance: string
}

const engagements: Engagement[] = [
  { id: 1, reference: "ENG-2024-001", client: "Société Minière Kankou", montant: "50 000 000", statut: "À corriger", echeance: "30/04/2025" },
  { id: 2, reference: "ENG-2024-002", client: "BTP Horizon Guinée", montant: "12 500 000", statut: "À corriger", echeance: "15/03/2025" },
  { id: 3, reference: "ENG-2024-003", client: "Techlab Guinée", montant: "8 200 000", statut: "En attente", echeance: "12/06/2025" },
  { id: 4, reference: "ENG-2024-004", client: "Immo Futur", montant: "25 000 000", statut: "Rejeté", echeance: "01/02/2025" },
  { id: 5, reference: "ENG-2024-005", client: "Clinique Saint Michel", montant: "6 400 000", statut: "En attente", echeance: "22/05/2025" },
  { id: 6, reference: "ENG-2024-006", client: "Translog Express", montant: "18 750 000", statut: "À corriger", echeance: "30/07/2025" },
  { id: 7, reference: "ENG-2024-007", client: "Holding Koumba", montant: "40 000 000", statut: "À corriger", echeance: "18/09/2025" },
  { id: 8, reference: "ENG-2024-008", client: "Agro-Export Mandiana", montant: "9 900 000", statut: "En attente", echeance: "05/11/2025" },
  { id: 9, reference: "ENG-2024-009", client: "Kadiatou Traoré", montant: "2 500 000", statut: "À corriger", echeance: "01/08/2025" },
  { id: 10, reference: "ENG-2024-010", client: "Alpha Diallo", montant: "3 200 000", statut: "Rejeté", echeance: "19/10/2025" },
]

export default function EngagementsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800">
      <aside className="fixed left-0 top-0 h-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
      ) : null}

      <main
        className="flex min-h-screen flex-col transition-all duration-200 md:ml-72"
      >
        <Navbar onToggleSidebar={() => setSidebarOpen((v) => !v)} />

        <div className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-slate-800">Liste des engagements à corriger</h1>
            </div>
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Rechercher"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div className="overflow-auto rounded-md border border-slate-200 shadow-sm bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="w-12 px-3 py-2"></th>
                  <th className="w-12 px-3 py-2">N°</th>
                  <th className="w-32 px-3 py-2">Référence</th>
                  <th className="px-3 py-2">Client</th>
                  <th className="w-28 px-3 py-2">Montant</th>
                  <th className="w-28 px-3 py-2">Statut</th>
                  <th className="w-32 px-3 py-2">Échéance</th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((engagement, idx) => (
                  <tr
                    key={engagement.id}
                    className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                  >
                    <td className="px-3 py-2 text-center text-slate-500">
                      <button
                        type="button"
                        onClick={() => router.push(`/traitement-des-donnees/donnees-a-corriger/engagements/${engagement.id}`)}
                        className="flex items-center justify-center rounded-full p-2 hover:border hover:border-blue-500 hover:text-blue-600"
                      >
                        <MdOutlineZoomIn size={18} />
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{engagement.reference}</td>
                    <td className="px-3 py-2">{engagement.client}</td>
                    <td className="px-3 py-2">{engagement.montant}</td>
                    <td className="px-3 py-2">{engagement.statut}</td>
                    <td className="px-3 py-2">{engagement.echeance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center">
            <button className="rounded-md bg-[#1E4F9B] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1a4587]">
              Créer une déclaration à partir des éléments cochés
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

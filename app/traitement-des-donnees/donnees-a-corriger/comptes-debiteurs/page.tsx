'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"

type CompteDebiteur = {
  id: number
  numeroCompte: string
  agence: string
  titulaire: string
  solde: string
  statut: string
}

const comptes: CompteDebiteur[] = [
  { id: 1, numeroCompte: "GN-001-000123", agence: "AG-001", titulaire: "Mamadou Bah", solde: "-2 500 000", statut: "Ouvert" },
  { id: 2, numeroCompte: "GN-001-000456", agence: "AG-001", titulaire: "Alpha Diallo", solde: "-1 200 000", statut: "Ouvert" },
  { id: 3, numeroCompte: "GN-002-000789", agence: "AG-002", titulaire: "Société Immo Futur", solde: "-8 000 000", statut: "Contentieux" },
  { id: 4, numeroCompte: "GN-003-000321", agence: "AG-003", titulaire: "Fatou Camara", solde: "-350 000", statut: "Ouvert" },
  { id: 5, numeroCompte: "GN-004-000654", agence: "AG-004", titulaire: "Translog Express", solde: "-12 750 000", statut: "Contentieux" },
  { id: 6, numeroCompte: "GN-005-000987", agence: "AG-005", titulaire: "Holding Koumba", solde: "-5 200 000", statut: "Clôture en cours" },
  { id: 7, numeroCompte: "GN-006-000147", agence: "AG-006", titulaire: "Kadiatou Traoré", solde: "-620 000", statut: "Ouvert" },
  { id: 8, numeroCompte: "GN-007-000258", agence: "AG-007", titulaire: "Techlab Guinée", solde: "-3 480 000", statut: "Ouvert" },
  { id: 9, numeroCompte: "GN-008-000369", agence: "AG-008", titulaire: "BTP Horizon Guinée", solde: "-9 320 000", statut: "Contentieux" },
  { id: 10, numeroCompte: "GN-009-000741", agence: "AG-009", titulaire: "Clinique Saint Michel", solde: "-1 890 000", statut: "Ouvert" },
]

export default function ComptesDebiteursPage() {
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
              <h1 className="text-lg font-semibold text-slate-800">Liste des comptes débiteurs à corriger</h1>
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
                  <th className="w-32 px-3 py-2">Numéro de compte</th>
                  <th className="w-24 px-3 py-2">Agence</th>
                  <th className="px-3 py-2">Titulaire</th>
                  <th className="w-28 px-3 py-2">Solde</th>
                  <th className="w-28 px-3 py-2">Statut</th>
                </tr>
              </thead>
              <tbody>
                {comptes.map((compte, idx) => (
                  <tr
                    key={compte.id}
                    className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                  >
                    <td className="px-3 py-2 text-center text-slate-500">
                      <button
                        type="button"
                        onClick={() => router.push(`/traitement-des-donnees/donnees-a-corriger/comptes-debiteurs/${compte.id}`)}
                        className="flex items-center justify-center rounded-full p-2 hover:border hover:border-blue-500 hover:text-blue-600"
                      >
                        <MdOutlineZoomIn size={18} />
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{compte.numeroCompte}</td>
                    <td className="px-3 py-2">{compte.agence}</td>
                    <td className="px-3 py-2">{compte.titulaire}</td>
                    <td className="px-3 py-2 text-red-600">{compte.solde}</td>
                    <td className="px-3 py-2">{compte.statut}</td>
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

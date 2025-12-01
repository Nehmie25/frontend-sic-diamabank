'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useState } from "react"
import { MdOutlineZoomIn } from "react-icons/md"

type Declaration = {
  id: number
  natureClient: string
  identifiant: string
  nom: string
  prenom: string
  sexe: string
  dateNaissance: string
  lieuNaissance: string
  paysNaissance: string
}

const declarations: Declaration[] = [
  { id: 1, natureClient: "0", identifiant: "950008", nom: "TIENE", prenom: "MOUSSA", sexe: "M", dateNaissance: "01/01/1980", lieuNaissance: "Guinée", paysNaissance: "FRANCE" },
  { id: 2, natureClient: "0", identifiant: "950005", nom: "AUTO", prenom: "COOL", sexe: "M", dateNaissance: "01/01/1960", lieuNaissance: "Guinée", paysNaissance: "ZA" },
  { id: 3, natureClient: "0", identifiant: "950005", nom: "AGBAN", prenom: "Landry", sexe: "M", dateNaissance: "01/01/1960", lieuNaissance: "Guinée", paysNaissance: "CI" },
  { id: 4, natureClient: "0", identifiant: "950004", nom: "DKY", prenom: "FAN", sexe: "M", dateNaissance: "01/01/1960", lieuNaissance: "Guinée", paysNaissance: "SL" },
  { id: 5, natureClient: "0", identifiant: "950007", nom: "KOUATE", prenom: "ABDOLAYE", sexe: "M", dateNaissance: "01/01/1960", lieuNaissance: "Guinée", paysNaissance: "DZ" },
]

export default function RejeteeParCentralePage() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )

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

        <div className="flex-1 overflow-y-auto px-4 pb-10 pt-6 sm:px-6">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr]">
              <div className="border-b border-slate-200 bg-slate-50 p-4 md:border-b-0 md:border-r">
                <h2 className="text-sm font-semibold text-slate-700">Liste des declarations</h2>
                <div className="mt-3 space-y-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span>Emetteur :</span>
                    <span className="rounded bg-[#e0edff] px-2 py-0.5 text-[11px] font-semibold text-[#1E4F9B]">AT00</span>
                  </div>
                  <div>Créée le : 22/02/2024</div>
                  <div>Note : 5</div>
                </div>
              </div>

              <div className="p-4 sm:p-6 space-y-3">
                <h2 className="text-sm font-semibold text-slate-700">
                  Liste des declarations de personnes physiques rejetées par la centrale
                </h2>

                <div className="overflow-auto">
                  <table className="min-w-full border border-slate-200 text-sm">
                    <thead className="bg-[#f3f6fb] text-xs font-semibold uppercase tracking-wide text-slate-600">
                      <tr>
                        <th className="w-12 border border-slate-200 px-3 py-2 text-center"></th>
                        <th className="w-12 border border-slate-200 px-3 py-2 text-center">N°</th>
                        <th className="w-24 border border-slate-200 px-3 py-2 text-left">Nature client</th>
                        <th className="w-28 border border-slate-200 px-3 py-2 text-left">Identifiant</th>
                        <th className="border border-slate-200 px-3 py-2 text-left">Nom</th>
                        <th className="border border-slate-200 px-3 py-2 text-left">Prénom</th>
                        <th className="w-16 border border-slate-200 px-3 py-2 text-left">Sexe</th>
                        <th className="w-32 border border-slate-200 px-3 py-2 text-left">Date de naissance</th>
                        <th className="border border-slate-200 px-3 py-2 text-left">Lieu de naissance</th>
                        <th className="border border-slate-200 px-3 py-2 text-left">Pays de naissance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {declarations.map((item, idx) => (
                        <tr key={item.id} className={`${idx % 2 === 0 ? "bg-[#eef3ff]" : "bg-white"} text-slate-700`}>
                          <td className="border border-slate-200 px-3 py-2 text-center">
                            <button
                              type="button"
                              className="flex h-8 w-8 items-center justify-center rounded-full hover:border hover:border-blue-500 hover:text-blue-600"
                              aria-label="Voir la déclaration"
                            >
                              <MdOutlineZoomIn size={18} />
                            </button>
                          </td>
                          <td className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800">
                            {idx + 1}
                          </td>
                          <td className="border border-slate-200 px-3 py-2">{item.natureClient}</td>
                          <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-800">{item.identifiant}</td>
                          <td className="border border-slate-200 px-3 py-2">{item.nom}</td>
                          <td className="border border-slate-200 px-3 py-2">{item.prenom}</td>
                          <td className="border border-slate-200 px-3 py-2">{item.sexe}</td>
                          <td className="border border-slate-200 px-3 py-2">{item.dateNaissance}</td>
                          <td className="border border-slate-200 px-3 py-2">{item.lieuNaissance}</td>
                          <td className="border border-slate-200 px-3 py-2">{item.paysNaissance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-[#eef2f6] px-3 py-2">
                  <div className="text-xs text-slate-600">Total : {declarations.length}</div>
                  <div className="text-xs text-slate-600">10</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

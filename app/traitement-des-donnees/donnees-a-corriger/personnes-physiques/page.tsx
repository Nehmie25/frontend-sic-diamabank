'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"

type PersonnePhysique = {
  id: number
  natureClient: number
  identifiant: string
  nom: string
  prenom: string
  sexe: string
  dateNaissance: string
  lieuNaissance: string
  paysNaissance: string
  adresse: string
}

const personnes: PersonnePhysique[] = [
  { id: 1, natureClient: 0, identifiant: "092382", nom: "QUO", prenom: "", sexe: "M", dateNaissance: "01/01/1962", lieuNaissance: "KOULE/N ZEREKORE", paysNaissance: "GN", adresse: "HOROYA" },
  { id: 2, natureClient: 0, identifiant: "092381", nom: "MICHEL", prenom: "", sexe: "M", dateNaissance: "01/01/1982", lieuNaissance: "N'ZEREKORE", paysNaissance: "GN", adresse: "TILEPOULOU" },
  { id: 3, natureClient: 0, identifiant: "092380", nom: "JEAN WILLIAMS", prenom: "", sexe: "M", dateNaissance: "05/01/1986", lieuNaissance: "N'ZEREKORE", paysNaissance: "GN", adresse: "BOMA" },
  { id: 4, natureClient: 0, identifiant: "092378", nom: "LABILE", prenom: "", sexe: "M", dateNaissance: "28/01/1993", lieuNaissance: "YOMOU", paysNaissance: "GN", adresse: "KONIA" },
  { id: 5, natureClient: 0, identifiant: "092377", nom: "LANCINE", prenom: "", sexe: "M", dateNaissance: "05/01/1995", lieuNaissance: "KISSIDOUGOU", paysNaissance: "GN", adresse: "BEYLA" },
  { id: 6, natureClient: 0, identifiant: "092376", nom: "MAMADOU ADAMA", prenom: "", sexe: "M", dateNaissance: "05/01/1990", lieuNaissance: "CONAKRY", paysNaissance: "GN", adresse: "BEYLA" },
  { id: 7, natureClient: 0, identifiant: "092375", nom: "FARAH M'BEMBA", prenom: "", sexe: "M", dateNaissance: "10/01/1998", lieuNaissance: "GUECKEDOU", paysNaissance: "GN", adresse: "BEYLA" },
  { id: 8, natureClient: 0, identifiant: "092355", nom: "MAMADOU SANOUSSY", prenom: "", sexe: "M", dateNaissance: "20/01/1998", lieuNaissance: "FRIA", paysNaissance: "GN", adresse: "KISSIBOU" },
  { id: 9, natureClient: 0, identifiant: "092353", nom: "ALY", prenom: "", sexe: "M", dateNaissance: "01/01/1992", lieuNaissance: "CONAKRY", paysNaissance: "GN", adresse: "MORIBADOU/NIONSOMORIDOU" },
  { id: 10, natureClient: 0, identifiant: "092351", nom: "YAYA", prenom: "", sexe: "M", dateNaissance: "13/01/1986", lieuNaissance: "KEROUGANE", paysNaissance: "GN", adresse: "MORIBADOU/NIONSOMORIDOU" },
]

export default function PersonnesPhysiquesPage() {
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
              <h1 className="text-lg font-semibold text-slate-800">Liste des données de personnes physiques à corriger</h1>
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
                  <th className="w-28 px-3 py-2">Nature client</th>
                  <th className="w-28 px-3 py-2">Identifiant</th>
                  <th className="px-3 py-2">Nom</th>
                  <th className="px-3 py-2">Prénom</th>
                  <th className="w-20 px-3 py-2">Sexe</th>
                  <th className="w-32 px-3 py-2">Date de naissance</th>
                  <th className="px-3 py-2">Lieu de naissance</th>
                  <th className="px-3 py-2">Pays de naissance</th>
                  <th className="px-3 py-2">Adresse</th>
                </tr>
              </thead>
              <tbody>
                {personnes.map((personne, idx) => (
                  <tr
                    key={personne.id}
                    className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                  >
                    <td className="px-3 py-2 text-center text-slate-500">
                      <button
                        type="button"
                        onClick={() => router.push(`/traitement-des-donnees/donnees-a-corriger/personnes-physiques/${personne.id}`)}
                        className="flex items-center justify-center rounded-full p-2 hover:border hover:border-blue-500 hover:text-blue-600"
                      >
                        <MdOutlineZoomIn size={18} />
                      </button>
                    </td>
                    <td className="px-3 py-2">
                      <input type="checkbox" className="checkbox checkbox-sm" />
                    </td>
                    <td className="px-3 py-2">{personne.natureClient}</td>
                    <td className="px-3 py-2 font-semibold text-slate-700">{personne.identifiant}</td>
                    <td className="px-3 py-2">{personne.nom}</td>
                    <td className="px-3 py-2">{personne.prenom}</td>
                    <td className="px-3 py-2">{personne.sexe}</td>
                    <td className="px-3 py-2">{personne.dateNaissance}</td>
                    <td className="px-3 py-2">{personne.lieuNaissance}</td>
                    <td className="px-3 py-2">{personne.paysNaissance}</td>
                    <td className="px-3 py-2">{personne.adresse}</td>
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

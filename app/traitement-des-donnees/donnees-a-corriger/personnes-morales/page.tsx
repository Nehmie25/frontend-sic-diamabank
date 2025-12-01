'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"

type PersonneMorale = {
  id: number
  natureClient: number
  identifiant: string
  raisonSociale: string
  sigle: string
  formeJuridique: string
  dateCreation: string
  pays: string
  adresse: string
}

const personnes: PersonneMorale[] = [
  { id: 1, natureClient: 1, identifiant: "RCM-2024-001", raisonSociale: "Société Minière Kankou", sigle: "SMK", formeJuridique: "SA", dateCreation: "12/03/2010", pays: "GN", adresse: "Conakry, Kaloum" },
  { id: 2, natureClient: 1, identifiant: "RCM-2024-002", raisonSociale: "BTP Horizon Guinée", sigle: "BTP-HG", formeJuridique: "SARL", dateCreation: "08/07/2015", pays: "GN", adresse: "Conakry, Dixinn" },
  { id: 3, natureClient: 1, identifiant: "RCM-2024-003", raisonSociale: "Agro-Export Mandiana", sigle: "AEM", formeJuridique: "SA", dateCreation: "23/02/2012", pays: "GN", adresse: "Kankan, Mandiana" },
  { id: 4, natureClient: 1, identifiant: "RCM-2024-004", raisonSociale: "Immo Futur", sigle: "IMF", formeJuridique: "SARL", dateCreation: "14/11/2018", pays: "GN", adresse: "Conakry, Ratoma" },
  { id: 5, natureClient: 1, identifiant: "RCM-2024-005", raisonSociale: "Techlab Guinée", sigle: "TLG", formeJuridique: "SAS", dateCreation: "19/05/2020", pays: "GN", adresse: "Conakry, Lambanyi" },
  { id: 6, natureClient: 1, identifiant: "RCM-2024-006", raisonSociale: "Commerce Atlantique", sigle: "COATL", formeJuridique: "SA", dateCreation: "30/09/2013", pays: "GN", adresse: "Kindia, Centre" },
  { id: 7, natureClient: 1, identifiant: "RCM-2024-007", raisonSociale: "Translog Express", sigle: "TLE", formeJuridique: "SARL", dateCreation: "05/01/2017", pays: "GN", adresse: "Boké, Kamsar" },
  { id: 8, natureClient: 1, identifiant: "RCM-2024-008", raisonSociale: "Énergie Verte Guinée", sigle: "EVG", formeJuridique: "SAS", dateCreation: "17/06/2016", pays: "GN", adresse: "Labé, Centre" },
  { id: 9, natureClient: 1, identifiant: "RCM-2024-009", raisonSociale: "Clinique Saint Michel", sigle: "CSM", formeJuridique: "SARL", dateCreation: "28/04/2011", pays: "GN", adresse: "Conakry, Matoto" },
  { id: 10, natureClient: 1, identifiant: "RCM-2024-010", raisonSociale: "Holding Koumba", sigle: "HK", formeJuridique: "SA", dateCreation: "09/09/2014", pays: "GN", adresse: "Conakry, Kipé" },
]

export default function PersonnesMoralesPage() {
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
              <h1 className="text-lg font-semibold text-slate-800">Liste des données de personnes morales à corriger</h1>
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
                  <th className="w-32 px-3 py-2">Identifiant</th>
                  <th className="px-3 py-2">Raison sociale</th>
                  <th className="px-3 py-2">Sigle</th>
                  <th className="w-28 px-3 py-2">Forme juridique</th>
                  <th className="w-32 px-3 py-2">Date de création</th>
                  <th className="px-3 py-2">Pays</th>
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
                        onClick={() => router.push(`/traitement-des-donnees/donnees-a-corriger/personnes-morales/${personne.id}`)}
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
                    <td className="px-3 py-2">{personne.raisonSociale}</td>
                    <td className="px-3 py-2">{personne.sigle}</td>
                    <td className="px-3 py-2">{personne.formeJuridique}</td>
                    <td className="px-3 py-2">{personne.dateCreation}</td>
                    <td className="px-3 py-2">{personne.pays}</td>
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

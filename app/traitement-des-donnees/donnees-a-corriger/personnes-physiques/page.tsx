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
  {
    id: 1,
    natureClient: 0,
    identifiant: "001516",
    nom: "SANOH",
    prenom: "IBRAHIMA",
    sexe: "M",
    dateNaissance: "01011989",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE COYAH / MANEAH KOUNTIAH STAD SANOH IBRAHIMA",
  },
  {
    id: 2,
    natureClient: 0,
    identifiant: "001508",
    nom: "KABA",
    prenom: "AMINATA",
    sexe: "F",
    dateNaissance: "02031990",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY/KALOUM MANQUEPAS KABA AMINATA",
  },
  {
    id: 3,
    natureClient: 0,
    identifiant: "001521",
    nom: "TOURE",
    prenom: "LANCINET",
    sexe: "M",
    dateNaissance: "20041972",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY/RATOMA KOLOMA II RAILS TOURE LANCINET",
  },
  {
    id: 4,
    natureClient: 0,
    identifiant: "001500",
    nom: "DIALLO",
    prenom: "MAMADOU SALIOU",
    sexe: "M",
    dateNaissance: "03022003",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY/RATOMA BANTOUNKA I DIALLO MAMADOU SALIOU",
  },
  {
    id: 5,
    natureClient: 0,
    identifiant: "001497",
    nom: "CAMARA",
    prenom: "MARIAMA CIRE",
    sexe: "F",
    dateNaissance: "22062000",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY/RATOMA KIPE CAMARA MARIAMA CIRE",
  },
  {
    id: 6,
    natureClient: 0,
    identifiant: "001537",
    nom: "CONTE",
    prenom: "CHEICK OUMAR",
    sexe: "M",
    dateNaissance: "20071991",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY / SONFONIA SONFONIA GARE CONTE CHEICK OUMAR",
  },
  {
    id: 7,
    natureClient: 0,
    identifiant: "001538",
    nom: "CONTE",
    prenom: "AISSATOU",
    sexe: "F",
    dateNaissance: "12122005",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY / DIXINN DIXINN CONTE AISSATOU",
  },
  {
    id: 8,
    natureClient: 0,
    identifiant: "001526",
    nom: "CAMARA",
    prenom: "MARIE JEANNE",
    sexe: "F",
    dateNaissance: "26101985",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY / MATOTO TOMBOLIA / PLATEAU CAMARA MARIE JEANNE",
  },
  {
    id: 9,
    natureClient: 0,
    identifiant: "001501",
    nom: "MILIMONO",
    prenom: "SAA MAMADY",
    sexe: "M",
    dateNaissance: "14101979",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY/RATOMA TAOUYAH MILIMONO SAA MAMADY",
  },
  {
    id: 10,
    natureClient: 0,
    identifiant: "001520",
    nom: "DIALLO",
    prenom: "ROUGUIATOU",
    sexe: "F",
    dateNaissance: "12101965",
    lieuNaissance: "GN",
    paysNaissance: "GN",
    adresse: "GUINEE CONAKRY/KALOUM SANDERVALL DIALLO ROUGUIATOU",
  },
]

export default function PersonnesPhysiquesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const router = useRouter()
  const rowShades = [
    "#c7d9e6",
    "#f6f9fb",
    "#e8c6c8",
    "#e8c6c8",
    "#eceff3",
    "#f6f9fb",
    "#e8c6c8",
    "#eceff3",
    "#eceff3",
    "#e8c6c8",
  ]

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

        <div className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6 flex justify-center">
          <div className="mx-auto w-full max-w-[1800px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
            <div className="flex flex-col gap-4 border-b border-slate-200 bg-[#f3f6fb] px-5 py-4 md:flex-row md:items-center md:justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Liste des données de personnes physiques à corriger</h1>
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Rechercher"
                  className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 pr-9 text-sm text-slate-700 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-1 focus:ring-blue-600"
                />
                <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr className="text-left text-[13px] uppercase tracking-wide text-slate-600">
                    <th className="w-12 px-3 py-2"></th>
                    <th className="w-12 px-3 py-2"></th>
                    <th className="w-14 px-3 py-2">N°</th>
                    <th className="w-28 px-3 py-2">Nature client</th>
                    <th className="w-28 px-3 py-2">Identifiant</th>
                    <th className="px-3 py-2">Nom</th>
                    <th className="px-3 py-2">Prénom</th>
                    <th className="w-16 px-3 py-2">Sexe</th>
                    <th className="w-32 px-3 py-2">Date de naissance</th>
                    <th className="w-32 px-3 py-2">Lieu de naissance</th>
                    <th className="w-32 px-3 py-2">Pays de naissance</th>
                    <th className="px-3 py-2">Adresse</th>
                  </tr>
                </thead>
                <tbody>
                  {personnes.map((personne, idx) => {
                    const shade = rowShades[idx % rowShades.length]
                    return (
                      <tr
                        key={personne.id}
                        style={{ backgroundColor: shade }}
                        className="text-[13px] text-slate-800 transition hover:bg-[#d8e5f0]"
                      >
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => router.push(`/traitement-des-donnees/donnees-a-corriger/personnes-physiques/${personne.id}`)}
                            className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-600 shadow-sm transition hover:border-blue-500 hover:text-blue-600"
                          >
                            <MdOutlineZoomIn size={16} />
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <input type="checkbox" className="h-4 w-4 cursor-pointer rounded border border-slate-400" />
                        </td>
                        <td className="px-3 py-2 text-center font-semibold text-slate-700">{idx + 1}</td>
                        <td className="px-3 py-2 text-center">{personne.natureClient}</td>
                        <td className="px-3 py-2 font-semibold text-slate-800">{personne.identifiant}</td>
                        <td className="px-3 py-2">{personne.nom}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{personne.prenom}</td>
                        <td className="px-3 py-2 text-center">{personne.sexe}</td>
                        <td className="px-3 py-2">{personne.dateNaissance}</td>
                        <td className="px-3 py-2">{personne.lieuNaissance}</td>
                        <td className="px-3 py-2">{personne.paysNaissance}</td>
                        <td className="px-3 py-2">{personne.adresse}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    className={`h-8 w-8 rounded-full border border-slate-400 bg-white text-center font-semibold shadow-sm transition ${
                      page === 1 ? "text-white bg-[#1e4f9b] border-[#1e4f9b]" : "hover:border-blue-500 hover:text-blue-600"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-2 text-base font-semibold">…</span>
                <button className="h-8 min-w-[2.25rem] rounded-full border border-slate-400 bg-white px-2 text-center font-semibold shadow-sm hover:border-blue-500 hover:text-blue-600">
                  43
                </button>
                <button className="h-8 w-8 rounded-full border border-slate-400 bg-white text-center font-semibold shadow-sm hover:border-blue-500 hover:text-blue-600">
                  &gt;
                </button>
                <select className="h-8 rounded border border-slate-300 bg-white px-2 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600">
                  <option>10</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-md bg-[#1e4f9b] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#183f7a]">
                  Créer une déclaration
                </button>
                <button className="rounded-md bg-[#3ca269] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#328a59]">
                  Corriger automatiquement
                </button>
                <button className="rounded-md bg-[#d4a01f] px-4 py-2 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-sm transition hover:bg-[#b88617]">
                  Exporter les erreurs
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

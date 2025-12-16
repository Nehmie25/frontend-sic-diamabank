'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"
import { FiChevronDown } from "react-icons/fi"
import { HiOutlineDownload } from "react-icons/hi"
import DatePicker from "react-datepicker"
import { fr } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"

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



export default function PersonnesPhysiquesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [isCardOpen, setIsCardOpen] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statistics, setStatistics] = useState({
    total: 0,
    enAttente: 0,
    rejetees: 0,
    validees: 0,
  })
  const [personnes, setPersonnes] = useState<PersonnePhysique[]>([])
  const router = useRouter()
  const [countLines, setCountLines] = useState(0);
  // Fonction pour appel api en get
  const fetchDataByDate = async (date: string) => {
    const response = await fetch(`http://10.0.16.4:8081/declaration/personnephysique?date=${date}`)

    const data = await response.text()

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const personnesElements = xmlDoc.querySelectorAll("PersonnePhysique");
    const mapped = Array.from(personnesElements).map(el => ({
      id: parseInt(el.getAttribute("IdInterneClt") || "0"),
      natureClient: parseInt(el.getAttribute("NatClient") || "0"),
      identifiant: el.getAttribute("NumSecSoc") || "",
      nom: el.getAttribute("NomNaiClt") || "",
      prenom: el.getAttribute("PrenomClt") || "",
      sexe: el.getAttribute("Sexe") || "",
      dateNaissance: el.getAttribute("DatNai") || "",
      lieuNaissance: el.getAttribute("VilleNai") || "",
      paysNaissance: el.getAttribute("PaysNai") || "",
      adresse: el.getAttribute("Adress") || "",
    }));
    setPersonnes(mapped);
    setCountLines(mapped.length);
    return mapped.length;
  }

  const handleSearch = async () => {
    // Vérifier si une date a été sélectionnée
    if (!selectedDate) {
      alert("Veuillez sélectionner une date");
      return;
    }

    // Formater la date en jj/mm/aa
    const formattedDate = selectedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit"
    });

    setIsLoading(true)
    setHasSearched(false)
    // Réinitialiser les statistiques à 0 pendant la recherche
    setStatistics({
      total: 0,
      enAttente: 0,
      rejetees: 0,
      validees: 0,
    })

    //faire la requête pour récupérer les données en fonction de la date sélectionnée
    const count = await fetchDataByDate(formattedDate);
    // console.log("Données récupérées :", data);

    // Simuler une latence de 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Une fois la recherche terminée, afficher les données
    setStatistics({
      total: count,
      enAttente: 0,
      rejetees: 0,
      validees: count,
    })
    setHasSearched(true)
    setIsLoading(false)
  }

  const handleExport = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <data>
    <declaration>
${personnes.map(p => `      <PersonnePhysique IdInterneClt="${p.id}" NatClient="${p.natureClient}" NumSecSoc="${p.identifiant}" NomNaiClt="${p.nom}" PrenomClt="${p.prenom}" Sexe="${p.sexe}" DatNai="${p.dateNaissance}" VilleNai="${p.lieuNaissance}" PaysNai="${p.paysNaissance}" Adress="${p.adresse}"></PersonnePhysique>`).join('\n')}
    </declaration>
  </data>
</Response>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personnes.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

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


          {/* Collapsible Card */}
          <div className="mb-6 rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setIsCardOpen(!isCardOpen)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
              <h2 className="text-base font-semibold text-slate-800">Filtres et options</h2>
              <FiChevronDown
                size={20}
                className={`text-slate-600 transition-transform duration-300 ${isCardOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isCardOpen && (
              <div className="border-t border-slate-200 px-6 py-4 bg-slate-50">
                <div className="flex items-center justify-center">
                  <div className="w-6/12 flex gap-4 items-center">
                    <div className="flex-1">
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={fr}
                        placeholderText="Sélectionner une date"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      disabled={isLoading}
                      className={`rounded-md px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors ${
                        isLoading 
                          ? "bg-slate-400 cursor-not-allowed" 
                          : "bg-[#1E4F9B] hover:bg-[#1a4587]"
                      }`}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
                    onClick={handleExport}
                    disabled={!hasSearched}
                    className={`rounded-md px-8 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-colors flex items-center gap-2 ${
                      hasSearched
                        ? "bg-[#1E4F9B] text-white hover:bg-[#1a4587] cursor-pointer"
                        : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                  >
                    <HiOutlineDownload size={18} />
                    Exporter le fichier
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="mb-6 rounded-md border border-orange-300 bg-orange-50 p-4 text-sm text-orange-800">
            <div className="flex items-center justify-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">Important : La recherche est nécessaire pour obtenir les données actualisées.</p>
            </div>
          </div>

          <div className="overflow-auto rounded-md border border-slate-200 shadow-sm bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="w-12 px-3 py-2"></th>
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
                    <td>1</td>
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

          {/* <div className="mt-6 flex items-center justify-center">
            <button className="rounded-md bg-[#1E4F9B] px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-[#1a4587]">
              Créer une déclaration à partir des éléments cochés
            </button>
          </div> */}
        </div>
      </main>
    </div>
  )
}

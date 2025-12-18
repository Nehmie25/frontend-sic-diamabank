'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { HiOutlineDownload, HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"

type CompteAssocie = {
  codAgce: string
  numCpt: string
  cleRib: string
  statCpt: string
}

type PersonneMorale = {
  natDec: string
  natClient: string
  idInterneClt: string
  denomSocial: string
  datCreat: string
  statut: string
  datCreaPart: string
  formeJuridique?: string
  paysSiegeSocial?: string
  villeSiegeSocial?: string
  mobile?: string
  adress?: string
  codePostal?: string
  resident?: string
  actEcon?: string
  sectInst?: string
  sitBancaire?: string
  rccm?: string
  nifp?: string
  email?: string
  compteAssocie?: CompteAssocie[]
}

export default function PersonnesMoralesPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statistics, setStatistics] = useState({
    total: 0,
    enAttente: 0,
    rejetees: 0,
    validees: 0,
  })
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const router = useRouter()
  const [personnes, setPersonnes] = useState<PersonneMorale[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    const savedDate = sessionStorage.getItem("pm_selectedDate")
    const savedPersonnes = sessionStorage.getItem("pm_personnes")
    const savedStatistics = sessionStorage.getItem("pm_statistics")
    const savedHasSearched = sessionStorage.getItem("pm_hasSearched")

    if (savedDate) {
      setSelectedDate(new Date(savedDate))
    }
    if (savedPersonnes) {
      try {
        setPersonnes(JSON.parse(savedPersonnes))
      } catch (error) {
        console.error("Erreur parsing personnes morales :", error)
      }
    }
    if (savedStatistics) {
      try {
        setStatistics(JSON.parse(savedStatistics))
      } catch (error) {
        console.error("Erreur parsing statistiques personnes morales :", error)
      }
    }
    if (savedHasSearched) {
      try {
        setHasSearched(JSON.parse(savedHasSearched))
      } catch (error) {
        console.error("Erreur parsing hasSearched personnes morales :", error)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedDate) {
      sessionStorage.setItem("pm_selectedDate", selectedDate.toISOString())
    }
  }, [selectedDate])

  useEffect(() => {
    if (personnes.length > 0) {
      sessionStorage.setItem("pm_personnes", JSON.stringify(personnes))
    }
  }, [personnes])

  useEffect(() => {
    if (statistics.total > 0) {
      sessionStorage.setItem("pm_statistics", JSON.stringify(statistics))
    }
  }, [statistics])

  useEffect(() => {
    sessionStorage.setItem("pm_hasSearched", JSON.stringify(hasSearched))
  }, [hasSearched])

  // Filtrage pour la recherche texte
  const filteredPersonnes = personnes.filter((personne) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      (personne.denomSocial || "").toLowerCase().includes(searchLower) ||
      (personne.idInterneClt || "").toLowerCase().includes(searchLower) ||
      (personne.adress || "").toLowerCase().includes(searchLower) ||
      (personne.paysSiegeSocial || "").toLowerCase().includes(searchLower) ||
      (personne.villeSiegeSocial || "").toLowerCase().includes(searchLower)
    )
  })

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredPersonnes.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPersonnes = filteredPersonnes.slice(startIndex, endIndex)

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const fetchDataByDate = async (date: string) => {
    const response = await fetch(`http://10.0.16.4:8081/declaration/personnemorale?date=${date}`)
    const data = await response.text()

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(data, "text/xml")
    const personnesElements = xmlDoc.querySelectorAll("PersonneMorale")
    const mapped = Array.from(personnesElements).map((el) => {
      const comptes = Array.from(el.querySelectorAll("CompteAssocie")).map((compte) => ({
        codAgce: compte.getAttribute("CodAgce") || "",
        numCpt: compte.getAttribute("NumCpt") || "",
        cleRib: compte.getAttribute("CleRib") || "",
        statCpt: compte.getAttribute("StatCpt") || "",
      }))

      return {
        natDec: el.getAttribute("NatDec") || "",
        natClient: el.getAttribute("NatClient") || "",
        idInterneClt: el.getAttribute("IdInterneClt") || "",
        denomSocial: el.getAttribute("DenomSocial") || "",
        datCreat: el.getAttribute("DatCreat") || "",
        statut: el.getAttribute("Statut") || "",
        datCreaPart: el.getAttribute("DatCreaPart") || "",
        formeJuridique: el.getAttribute("FormeJuridique") || "",
        paysSiegeSocial: el.getAttribute("PaysSiegeSocial") || "",
        villeSiegeSocial: el.getAttribute("VilleSiegeSocial") || "",
        mobile: el.getAttribute("Mobile") || "",
        adress: el.getAttribute("Adress") || "",
        codePostal: el.getAttribute("CodePostal") || "",
        resident: el.getAttribute("Resident") || "",
        actEcon: el.getAttribute("ActEcon") || "",
        sectInst: el.getAttribute("SectInst") || "",
        sitBancaire: el.getAttribute("SitBancaire") || "",
        rccm: el.getAttribute("RCCM") || "",
        nifp: el.getAttribute("NIFP") || "",
        email: el.getAttribute("Email") || "",
        compteAssocie: comptes,
      } as PersonneMorale
    })

    setPersonnes(mapped)
    return mapped.length
  }

  const handleSearch = async () => {
    if (!selectedDate) {
      alert("Veuillez sélectionner une date")
      return
    }

    const formattedDate = selectedDate.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    })

    setIsLoading(true)
    setHasSearched(false)
    setPersonnes([])
    setStatistics({
      total: 0,
      enAttente: 0,
      rejetees: 0,
      validees: 0,
    })

    await new Promise((resolve) => setTimeout(resolve, 500))

    const count = await fetchDataByDate(formattedDate)
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
    if (!hasSearched || personnes.length === 0) return

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <data>
    <declaration>
${personnes
        .map(
          (p) =>
            `      <PersonneMorale NatDec="${p.natDec}" NatClient="${p.natClient}" IdInterneClt="${p.idInterneClt}" DenomSocial="${p.denomSocial}" DatCreat="${p.datCreat}" Statut="${p.statut}" DatCreaPart="${p.datCreaPart}" FormeJuridique="${p.formeJuridique ?? ""}" PaysSiegeSocial="${p.paysSiegeSocial ?? ""}" VilleSiegeSocial="${p.villeSiegeSocial ?? ""}" Mobile="${p.mobile ?? ""}" Adress="${p.adress ?? ""}" CodePostal="${p.codePostal ?? ""}" Resident="${p.resident ?? ""}" ActEcon="${p.actEcon ?? ""}" SectInst="${p.sectInst ?? ""}" SitBancaire="${p.sitBancaire ?? ""}" RCCM="${p.rccm ?? ""}" NIFP="${p.nifp ?? ""}" Email="${p.email ?? ""}"></PersonneMorale>`
        )
        .join("\n")}
    </declaration>
  </data>
</Response>`

    const blob = new Blob([xml], { type: "application/xml" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "personnes-morales.xml"
    a.click()
    URL.revokeObjectURL(url)
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

        <div className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-slate-800">Liste des données de personnes morales</h1>
          </div>

          <div className="mb-6 rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="border-t border-slate-200 px-6 py-6 bg-slate-50">
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
                    className={`rounded-md px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition-colors ${isLoading ? "bg-slate-400 cursor-not-allowed" : "bg-[#1E4F9B] hover:bg-[#1a4587]"
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

              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleExport}
                  disabled={!hasSearched}
                  className={`rounded-md px-8 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-colors flex items-center gap-2 ${hasSearched ? "bg-[#1E4F9B] text-white hover:bg-[#1a4587] cursor-pointer" : "bg-slate-300 text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <HiOutlineDownload size={18} />
                  Exporter le fichier
                </button>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-md border border-orange-300 bg-orange-50 p-4 text-sm text-orange-800">
            <div className="flex items-center justify-center gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">Important : La recherche est nécessaire pour obtenir les données actualisées.</p>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <div className="relative w-full max-w-xs">
              <input
                type="text"
                placeholder="Rechercher"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <th className="w-28 px-3 py-2">Nature déclaration</th>
                  <th className="w-28 px-3 py-2">IdInterneClt</th>
                  <th className="px-3 py-2">Dénomination sociale</th>
                  <th className="px-3 py-2">Date création</th>
                  <th className="w-20 px-3 py-2">Statut</th>
                  <th className="w-32 px-3 py-2">Date création part.</th>
                  <th className="px-3 py-2">Pays siège social</th>
                  <th className="px-3 py-2">Ville siège social</th>
                  <th className="px-3 py-2">Mobile</th>
                  <th className="px-3 py-2">Adresse</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={13} className="px-3 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-slate-600 font-medium">Chargement des données...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPersonnes.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-3 py-8 text-center text-slate-500">
                      {searchTerm ? "Aucun résultat trouvé" : "Aucune donnée disponible"}
                    </td>
                  </tr>
                ) : (
                  paginatedPersonnes.map((personne, idx) => (
                    <tr
                      key={`${personne.idInterneClt}-${idx}`}
                      className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                    >
                      <td className="px-3 py-2 text-center text-slate-500">
                        <button
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem("personneMoraleData", JSON.stringify(personne))
                            router.push(`/traitement-des-donnees/donnees-a-corriger/personnes-morales/${personne.idInterneClt}`)
                          }}
                          className="flex items-center justify-center rounded-full p-2 hover:border hover:border-blue-500 hover:text-blue-600"
                        >
                          <MdOutlineZoomIn size={18} />
                        </button>
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{startIndex + idx + 1}</td>
                      <td className="px-3 py-2">{personne.natClient}</td>
                      <td className="px-3 py-2">{personne.natDec}</td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{personne.idInterneClt}</td>
                      <td className="px-3 py-2">{personne.denomSocial}</td>
                      <td className="px-3 py-2">{personne.datCreat}</td>
                      <td className="px-3 py-2">{personne.statut}</td>
                      <td className="px-3 py-2">{personne.datCreaPart}</td>
                      <td className="px-3 py-2">{personne.paysSiegeSocial}</td>
                      <td className="px-3 py-2">{personne.villeSiegeSocial}</td>
                      <td className="px-3 py-2">{personne.mobile}</td>
                      <td className="px-3 py-2">{personne.adress}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Affichage {startIndex + 1} à {Math.min(endIndex, filteredPersonnes.length)} sur {filteredPersonnes.length} résultats
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed bg-[#1E4F9B] hover:bg-[#1a4587]"
                >
                  Précédent
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${currentPage === page
                        ? "bg-[#1E4F9B] text-white"
                        : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="rounded-md px-3 py-2 text-sm font-semibold text-white transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed bg-[#1E4F9B] hover:bg-[#1a4587]"
                >
                  Suivant
                </button>
              </div>
            </div>
            
          )}

        </div>
      </main>
    </div>
  )
}

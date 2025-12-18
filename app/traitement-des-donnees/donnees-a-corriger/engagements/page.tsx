'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState,useEffect } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"
import { HiOutlineDownload } from "react-icons/hi"
import { fr } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"
import DatePicker from "react-datepicker"


type Engagement = {
  natDec: string;
  typEve: string;
  refIntEng: string;
  ligneParent: string;
  typeModif: string;
  cloture: string;
  dateMEP: string;
  typEng: string;
  mntEng: string;
  mntInt: string;
  codDev: string;
  periodRemb: string;
  txIntEng: string;
  typTxInt: string;
  txEffGlob: string;
  moyRemb: string;
  typAmo: string;
  typDiffAmo: string;
  mntEch: string;
  nbrEch: string;
  datPremEch: string;
  datFin: string;
  mntFrais: string;
  mntComm: string;
  codAgce: string;
  estRachatCreance: string;
  datEvent: string;
  beneficiaire:Array<{
    IdIntBen: string;
    PourBenef: string;
  }>
}



export default function EngagementsPage() {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [statistics, setStatistics] = useState({
    total: 0,
    enAttente: 0,
    rejetees: 0,
    validees: 0,
  })
  const [engagements, setEngagements] = useState<Engagement[]>([])
  const [countLines, setCountLines] = useState(0)

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const router = useRouter()

  useEffect(() => {
    const savedDate = sessionStorage.getItem('selectedDateEngagements');
    const savedEngagements = sessionStorage.getItem('engagements');
    const savedStatisticsEngagements = sessionStorage.getItem('statisticsEngagements');
    const savedHasSearchedEngagements = sessionStorage.getItem('hasSearchedEngagements');
  
    if (savedDate) {
      const date = new Date(savedDate);
      setSelectedDate(date);
    }

    if (savedEngagements) {
      try {
        const personnesData = JSON.parse(savedEngagements);
        setEngagements(personnesData);
      } catch (error) {
        console.error('Erreur lors du parsing des engagements:', error);
       }
    }

    if (savedStatisticsEngagements) {
      try {
        setStatistics(JSON.parse(savedStatisticsEngagements));
      } catch (error) {
        console.error('Erreur lors du parsing des statistiques:', error);
      }
    }

    if (savedHasSearchedEngagements) {
      try {
        setHasSearched(JSON.parse(savedHasSearchedEngagements));
      } catch (error) {
        console.error('Erreur lors du parsing de hasSearched:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDate) {
      sessionStorage.setItem('selectedDateEngagements', selectedDate.toISOString());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (engagements.length > 0) {
      sessionStorage.setItem('engagements', JSON.stringify(engagements));
    }
  }, [engagements]);

  useEffect(() => {
    if (statistics.total > 0) {
      sessionStorage.setItem('statisticsEngagements', JSON.stringify(statistics));
    }
  }, [statistics]);

  useEffect(() => {
    sessionStorage.setItem('hasSearchedEngagements', JSON.stringify(hasSearched));
  }, [hasSearched]);

  const fetchDataByDate = async (date: string) => {
    const response = await fetch(`http://10.0.16.4:8081/declaration/engagements?date=${date}`)

    const data = await response.text()

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data, "text/xml");
    const personnesElements = xmlDoc.querySelectorAll("Engagement");
    const mapped = Array.from(personnesElements).map(el => {

        const beneficiaires = Array.from(el.querySelectorAll("Beneficiaire")).map(beneficiaire => ({
          IdIntBen: beneficiaire.getAttribute("IdIntBen") || "",
          PourBenef: beneficiaire.getAttribute("PourBenef") || "",
        }));

        return {
          natDec: el.getAttribute("NatDec") || "",
          typEve: el.getAttribute("TypEve") || "",
          refIntEng: el.getAttribute("RefIntEng") || "",
          ligneParent: el.getAttribute("LigneParent") || "",
          typeModif: el.getAttribute("TypeModif") || "",
          cloture: el.getAttribute("Cloture") || "",
          dateMEP: el.getAttribute("DateMEP") || "",
          typEng: el.getAttribute("TypEng") || "",
          mntEng: el.getAttribute("MntEng") || "",
          mntInt: el.getAttribute("MntInt") || "",
          codDev: el.getAttribute("CodDev") || "",
          periodRemb: el.getAttribute("PeriodRemb") || "",
          txIntEng: el.getAttribute("TxIntEng") || "",
          typTxInt: el.getAttribute("TypTxInt") || "",
          txEffGlob: el.getAttribute("TxEffGlob") || "",
          moyRemb: el.getAttribute("MoyRemb") || "",
          typAmo: el.getAttribute("TypAmo") || "",
          typDiffAmo: el.getAttribute("TypDiffAmo") || "",
          mntEch: el.getAttribute("MntEch") || "",
          nbrEch: el.getAttribute("NbrEch") || "",
          datPremEch: el.getAttribute("DatPremEch") || "",
          datFin: el.getAttribute("DatFin") || "",
          mntFrais: el.getAttribute("MntFrais") || "",
          mntComm: el.getAttribute("MntComm") || "",
          codAgce: el.getAttribute("CodAgce") || "",
          estRachatCreance: el.getAttribute("EstRachatCreance") || "",
          datEvent: el.getAttribute("DatEvent") || "",
          beneficiaire: beneficiaires,
        }
    });
    setEngagements(mapped);
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
    // Vider les personnes et réinitialiser les statistiques à 0 pendant la recherche
    setEngagements([])
    setStatistics({
      total: 0,
      enAttente: 0,
      rejetees: 0,
      validees: 0,
    })

    // Simuler une latence de 2 secondes
    await new Promise(resolve => setTimeout(resolve, 500))

    //faire la requête pour récupérer les données en fonction de la date sélectionnée
    const count = await fetchDataByDate(formattedDate);

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
    <declaration>
    ${engagements.map(p => `      <Engagement NatDec="${p.natDec || ''}" typEve="${p.typEve}" refIntEng="${p.refIntEng || ''}" ligneParent="${p.ligneParent || ''}" typeModif="${p.typeModif || ''}" cloture="${p.cloture || ''}" dateMEP="${p.dateMEP || ''}" typEng="${p.typEng || ''}" mntEng="${p.mntEng || ''}" mntInt="${p.mntInt || ''}" codDev="${p.codDev || ''}" periodRemb="${p.periodRemb || ''}" txIntEng="${p.txIntEng || ''}" typTxInt="${p.typTxInt || ''}" txEffGlob="${p.txEffGlob || ''}" moyRemb="${p.moyRemb || ''}" typAmo="${p.typAmo || ''}" typDiffAmo="${p.typDiffAmo || ''}" mntEch="${p.mntEch || ''}" nbrEch="${p.nbrEch || ''}" datPremEch="${p.datPremEch || ''}" datFin="${p.datFin || ''}" mntFrais="${p.mntFrais || ''}" mntComm="${p.mntComm || ''}" codAgce="${p.codAgce || ''}" estRachatCreance="${p.estRachatCreance || ''}" datEvent="${p.datEvent || ''}">
        ${Array.isArray(p.beneficiaire) ? p.beneficiaire.map(b => `          <Beneficiaire IdIntBen="${b.IdIntBen}" PourBenef = "${b.PourBenef}"> </Beneficiaire>`).join('\n') : ''}
      </Engagement>`).join('\n')}
    </declaration>
    `;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'engagements.xml';
    a.click();
    URL.revokeObjectURL(url);
  //   const xml = `<?xml version="1.0" encoding="UTF-8"?>
  //   <Response>
  //     <data>
  //       <declaration>
  //   ${engagements.map(p => `      <PersonnePhysique IdInterneClt="${p.id}" NatClient="${p.natureClient}" NumSecSoc="${p.identifiant}" NomNaiClt="${p.nom}" PrenomClt="${p.prenom}" Sexe="${p.sexe}" DatNai="${p.dateNaissance}" VilleNai="${p.lieuNaissance}" PaysNai="${p.paysNaissance}" Adress="${p.adresse}"></PersonnePhysique>`).join('\n')}
  //       </declaration>
  //     </data>
  //   </Response>`;

  //   const blob = new Blob([xml], { type: 'application/xml' });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'personnes.xml';
  //   a.click();
  //   URL.revokeObjectURL(url);
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
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-slate-800">Liste des données d'engagements</h1>
          </div>


          {/* Collapsible Card */}
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
                    disabled={engagements.length < 1}
                    className={`rounded-md px-8 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-colors flex items-center gap-2 ${
                      engagements.length > 0
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

          {/* Warning Message */}
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
                  <th className="w-28 px-3 py-2">reference</th>
                  <th className="w-28 px-3 py-2">montant</th>
                  <th className="w-28 px-3 py-2">montant totale interet</th>
                  <th className="px-3 py-2">devise</th>
                  <th className="px-3 py-2">nombre d'echerance</th>
                  <th className="px-3 py-2">date de fin</th>
                  <th className="w-20 px-3 py-2">periode de remboursement</th>
                  {/* <th className="w-32 px-3 py-2">Date de naissance</th>
                  <th className="px-3 py-2">Lieu de naissance</th>
                  <th className="px-3 py-2">Pays de naissance</th>
                  <th className="px-3 py-2">Adresse</th> */}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-slate-600 font-medium">Chargement des données...</span>
                      </div>
                    </td>
                  </tr>
                ) : engagements.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-slate-500">
                      Aucune donnée disponible
                    </td>
                  </tr>
                ) : (
                  engagements.map((Engagement, idx) => (
                    <tr
                      key={Engagement.refIntEng}
                      className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                    >
                      <td className="px-3 py-2 text-center text-slate-500">
                        <button
                          type="button"
                          onClick={() => {
                            sessionStorage.setItem('engagementData', JSON.stringify(Engagement));
                            router.push(`/traitement-des-donnees/donnees-a-corriger/engagements/${Engagement.refIntEng}`)
                          }}
                          className="flex items-center justify-center rounded-full p-2 hover:border hover:border-blue-500 hover:text-blue-600"
                        >
                          <MdOutlineZoomIn size={18} />
                        </button>
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{idx + 1}</td>
                      <td className="px-3 py-2">{Engagement.refIntEng}</td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{Engagement.mntEng}</td>
                      <td className="px-3 py-2">{Engagement.mntInt}</td>
                      <td className="px-3 py-2">{Engagement.codDev}</td>
                      <td className="px-3 py-2">{Engagement.nbrEch}</td>
                      <td className="px-3 py-2">{Engagement.datFin}</td>
                      <td className="px-3 py-2">{Engagement.periodRemb}</td>
                      {/* <td className="px-3 py-2">{Engagement.sexe}</td>
                      <td className="px-3 py-2">{Engagement.dateNaissance}</td>
                      <td className="px-3 py-2">{Engagement.lieuNaissance}</td>
                      <td className="px-3 py-2">{Engagement.paysNaissance}</td>
                      <td className="px-3 py-2">{Engagement.adresse}</td> */}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </main>
    </div>
  )
}

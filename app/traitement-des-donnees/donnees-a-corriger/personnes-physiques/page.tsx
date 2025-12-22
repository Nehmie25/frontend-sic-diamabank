'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { MdOutlineZoomIn } from "react-icons/md"
import { FiChevronDown } from "react-icons/fi"
import { HiOutlineDownload } from "react-icons/hi"
import DatePicker from "react-datepicker"
import { fr } from "date-fns/locale"
import { toast, ToastContainer } from "react-toastify"
import "react-datepicker/dist/react-datepicker.css"
import "react-toastify/dist/ReactToastify.css"

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
  // Nouveaux champs
  natDec?: string
  idInterneClt?: string
  datCreaPart?: string
  nomNaiClt?: string
  prenomClt?: string
  etatCivil?: string
  nomPere?: string
  prenomPere?: string
  nomNaiMere?: string
  prmMre?: string
  villeNai?: string
  natClt?: string
  resident?: string
  paysRes?: string
  mobile?: string
  communeAdress?: string
  sectInst?: string
  numSecSoc?: string
  sTutelle?: string
  statutClt?: string
  sitBancaire?: string
  compteAssocie?: Array<{
    codAgce: string
    numCpt: string
    cleRib: string
    typCpt: string
    statCpt: string
  }>
  piece?: Array<{
    typPiece: string
    numPiece: string
    datEmiPiece: string
    lieuEmiPiece: string
    paysEmiPiece: string
    finValPiece: string
  }>
}



export default function PersonnesPhysiquesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
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
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // useEffect pour initialiser le sidebar depuis le client seulement
  useEffect(() => {
    const isLargeScreen = window.matchMedia("(min-width: 768px)").matches
    setSidebarOpen(isLargeScreen)
  }, [])

  // useEffect pour charger et persister la date
  useEffect(() => {
    const savedDate = sessionStorage.getItem('selectedDate');
    const savedPersonnes = sessionStorage.getItem('personnes');
    const savedStatistics = sessionStorage.getItem('statistics');
    const savedHasSearched = sessionStorage.getItem('hasSearched');

    if (savedDate) {
      const date = new Date(savedDate);
      setSelectedDate(date);
    }

    if (savedPersonnes) {
      try {
        const personnesData = JSON.parse(savedPersonnes);
        setPersonnes(personnesData);
      } catch (error) {
        console.error('Erreur lors du parsing des personnes:', error);
      }
    }

    if (savedStatistics) {
      try {
        setStatistics(JSON.parse(savedStatistics));
      } catch (error) {
        console.error('Erreur lors du parsing des statistiques:', error);
      }
    }

    if (savedHasSearched) {
      try {
        setHasSearched(JSON.parse(savedHasSearched));
      } catch (error) {
        console.error('Erreur lors du parsing de hasSearched:', error);
      }
    }
  }, []);

  // useEffect pour persister la date et les données à chaque changement
  useEffect(() => {
    if (selectedDate) {
      sessionStorage.setItem('selectedDate', selectedDate.toISOString());
    }
  }, [selectedDate]);

  useEffect(() => {
    if (personnes.length > 0) {
      sessionStorage.setItem('personnes', JSON.stringify(personnes));
    }
  }, [personnes]);

  useEffect(() => {
    if (statistics.total > 0) {
      sessionStorage.setItem('statistics', JSON.stringify(statistics));
    }
  }, [statistics]);

  useEffect(() => {
    sessionStorage.setItem('hasSearched', JSON.stringify(hasSearched));
  }, [hasSearched]);

  // Fonction pour appel api en get
  const fetchDataByDate = async (date: string) => {
    try {
      const response = await fetch(`http://10.0.16.4:8081/declaration/personnephysique?date=${date}`)

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
      }

      const data = await response.text()

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, "text/xml");
      
      // Vérifier les erreurs de parsing XML
      if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
        throw new Error("Erreur lors du parsing XML: Le format du document n'est pas valide");
      }

      const personnesElements = xmlDoc.querySelectorAll("PersonnePhysique");
      const mapped = Array.from(personnesElements).map(el => {
        // Récupérer tous les CompteAssocie
        const comptes = Array.from(el.querySelectorAll("CompteAssocie")).map(compte => ({
          codAgce: compte.getAttribute("CodAgce") || "",
          numCpt: compte.getAttribute("NumCpt") || "",
          cleRib: compte.getAttribute("CleRib") || "",
          typCpt: compte.getAttribute("TypCpt") || "",
          statCpt: compte.getAttribute("StatCpt") || "",
        }));

        // Récupérer tous les Piece
        const pieces = Array.from(el.querySelectorAll("Piece")).map(piece => ({
          typPiece: piece.getAttribute("TypPiece") || "",
          numPiece: piece.getAttribute("NumPiece") || "",
          datEmiPiece: piece.getAttribute("DatEmiPiece") || "",
          lieuEmiPiece: piece.getAttribute("LieuEmiPiece") || "",
          paysEmiPiece: piece.getAttribute("PaysEmiPiece") || "",
          finValPiece: piece.getAttribute("FinValPiece") || "",
        }));

        return {
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
          // Nouveaux champs
          natDec: el.getAttribute("NatDec") || "",
          idInterneClt: el.getAttribute("IdInterneClt") || "",
          datCreaPart: el.getAttribute("DatCreaPart") || "",
          nomNaiClt: el.getAttribute("NomNaiClt") || "",
          prenomClt: el.getAttribute("PrenomClt") || "",
          etatCivil: el.getAttribute("EtatCivil") || "",
          nomPere: el.getAttribute("NomPere") || "",
          prenomPere: el.getAttribute("PrenomPere") || "",
          nomNaiMere: el.getAttribute("NomNaiMere") || "",
          prmMre: el.getAttribute("PrmMre") || "",
          villeNai: el.getAttribute("VilleNai") || "",
          natClt: el.getAttribute("NatClt") || "",
          resident: el.getAttribute("Resident") || "",
          paysRes: el.getAttribute("PaysRes") || "",
          mobile: el.getAttribute("Mobile") || "",
          communeAdress: el.getAttribute("CommuneAdress") || "",
          sectInst: el.getAttribute("SectInst") || "",
          numSecSoc: el.getAttribute("NumSecSoc") || "",
          sTutelle: el.getAttribute("STutelle") || "",
          statutClt: el.getAttribute("StatutClt") || "",
          sitBancaire: el.getAttribute("SitBancaire") || "",
          // Éléments imbriqués
          compteAssocie: comptes,
          piece: pieces,
        };
      });
      setPersonnes(mapped);
      setCountLines(mapped.length);
      return mapped.length;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur inconnue s'est produite";
      console.error("Erreur lors de la récupération des données:", errorMessage);
      toast.error(`Erreur: ${errorMessage}`);
      return 0;
    }
  }

  const handleSearch = async () => {
    // Vérifier si une date a été sélectionnée
    if (!selectedDate) {
      toast.warning("Veuillez sélectionner une date");
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
    // setPersonnes([])
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
    ${personnes.map(p => `      <PersonnePhysique NatDec="${p.natDec || ''}" NatClient="${p.natureClient}" IdInterneClt="${p.id}" DatCreaPart="${p.datCreaPart || ''}" NomNaiClt="${p.nomNaiClt || ''}" PrenomClt="${p.prenomClt || ''}" Sexe="${p.sexe}" DatNai="${p.dateNaissance}" EtatCivil="${p.etatCivil || ''}" NomPere="${p.nomPere || ''}" PrenomPere="${p.prenomPere || ''}" NomNaiMere="${p.nomNaiMere || ''}" PrmMre="${p.prmMre || ''}" VilleNai="${p.villeNai || ''}" PaysNai="${p.paysNaissance}" NatClt="${p.natClt || ''}" Resident="${p.resident || ''}" PaysRes="${p.paysRes || ''}" Mobile="${p.mobile || ''}" Adress="${p.adresse}" CommuneAdress="${p.communeAdress || ''}" SectInst="${p.sectInst || ''}" NumSecSoc="${p.identifiant}" STutelle="${p.sTutelle || ''}" StatutClt="${p.statutClt || ''}" SitBancaire="${p.sitBancaire || ''}">
    ${p.compteAssocie?.map(c => `        <CompteAssocie CodAgce="${c.codAgce}" NumCpt="${c.numCpt}" CleRib="${c.cleRib}" TypCpt="${c.typCpt}" StatCpt="${c.statCpt}"> </CompteAssocie>`).join('\n') || ''}
    ${p.piece?.map(pi => `        <Piece TypPiece="${pi.typPiece}" NumPiece="${pi.numPiece}" DatEmiPiece="${pi.datEmiPiece}" LieuEmiPiece="${pi.lieuEmiPiece}" PaysEmiPiece="${pi.paysEmiPiece}" FinValPiece="${pi.finValPiece}"> </Piece>`).join('\n') || ''}
    </PersonnePhysique>`).join('\n')}
    </declaration>
    `;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'personnes.xml';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Fonction pour filtrer les données
  const filteredPersonnes = personnes.filter(personne => {
    const searchLower = searchTerm.toLowerCase();
    return (
      personne.nom.toLowerCase().includes(searchLower) ||
      personne.prenom.toLowerCase().includes(searchLower) ||
      personne.identifiant.toLowerCase().includes(searchLower) ||
      personne.adresse.toLowerCase().includes(searchLower) ||
      personne.lieuNaissance.toLowerCase().includes(searchLower) ||
      personne.paysNaissance.toLowerCase().includes(searchLower)  ||
      personne.sexe.toLowerCase().includes(searchLower)

    );
  });

  // Calcul de la pagination
  const totalPages = Math.ceil(filteredPersonnes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPersonnes = filteredPersonnes.slice(startIndex, endIndex);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton theme="light" />
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
            <h1 className="text-lg font-semibold text-slate-800">Liste des données de personnes physiques</h1>
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
                    disabled={personnes.length < 1}
                    className={`rounded-md px-8 py-2 text-sm font-semibold uppercase tracking-wide shadow-sm transition-colors flex items-center gap-2 ${
                      personnes.length > 0
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
                ) : filteredPersonnes.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-3 py-8 text-center text-slate-500">
                      {searchTerm ? "Aucun résultat trouvé" : "Aucune donnée disponible"}
                    </td>
                  </tr>
                ) : (
                  paginatedPersonnes.map((personne, idx) => (
                    <tr
                      key={personne.id}
                      className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                    >
                      <td className="px-3 py-2 text-center text-slate-500">
                        <button
                          type="button"
                          onClick={() => {
                            // Stocker les données dans sessionStorage
                            sessionStorage.setItem('personneData', JSON.stringify(personne));
                            router.push(`/traitement-des-donnees/donnees-a-corriger/personnes-physiques/${personne.id}`);
                          }}
                          className="flex items-center justify-center rounded-full p-2 hover:text-blue-600"
                        >
                          <MdOutlineZoomIn size={18} />
                        </button>
                      </td>
                      <td className="px-3 py-2 font-semibold text-slate-700">{startIndex + idx + 1}</td>
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
                      className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                        currentPage === page
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

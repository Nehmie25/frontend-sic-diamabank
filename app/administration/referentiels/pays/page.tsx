'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useEffect, useMemo, useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"

type Pays = {
  alpha2: string
  numeric: string
  nom: string
  gentile: string
}

const paysData: Pays[] = [
  { alpha2: "AF", numeric: "004", nom: "Afghanistan", gentile: "Afghan(e)" },
  { alpha2: "ZA", numeric: "710", nom: "Afrique du Sud", gentile: "Sud-Africain(e)" },
  { alpha2: "AL", numeric: "008", nom: "Albanie", gentile: "Albanais(e)" },
  { alpha2: "DE", numeric: "276", nom: "Allemagne", gentile: "Allemand(e)" },
  { alpha2: "DZ", numeric: "012", nom: "Algérie", gentile: "Algérien(ne)" },
  { alpha2: "AD", numeric: "020", nom: "Andorre", gentile: "Andorran(e)" },
  { alpha2: "AO", numeric: "024", nom: "Angola", gentile: "Angolais(e)" },
  { alpha2: "SA", numeric: "682", nom: "Arabie Saoudite", gentile: "Saoudien(ne)" },
  { alpha2: "AR", numeric: "032", nom: "Argentine", gentile: "Argentin(e)" },
  { alpha2: "AM", numeric: "051", nom: "Arménie", gentile: "Arménien(ne)" },
  { alpha2: "AU", numeric: "036", nom: "Australie", gentile: "Australien(ne)" },
  { alpha2: "AZ", numeric: "031", nom: "Azerbaïdjan", gentile: "Azerbaïdjanais(e)" },
  { alpha2: "BH", numeric: "048", nom: "Bahreïn", gentile: "Bahreïni(e)" },
  { alpha2: "BD", numeric: "050", nom: "Bangladesh", gentile: "Bangladais(e)" },
  { alpha2: "BE", numeric: "056", nom: "Belgique", gentile: "Belge" },
  { alpha2: "BJ", numeric: "204", nom: "Bénin", gentile: "Béninois(e)" },
  { alpha2: "BO", numeric: "068", nom: "Bolivie", gentile: "Bolivien(ne)" },
  { alpha2: "BR", numeric: "076", nom: "Brésil", gentile: "Brésilien(ne)" },
  { alpha2: "BG", numeric: "100", nom: "Bulgarie", gentile: "Bulgare" },
  { alpha2: "BF", numeric: "854", nom: "Burkina Faso", gentile: "Burkinabè" },
  { alpha2: "BI", numeric: "108", nom: "Burundi", gentile: "Burundais(e)" },
  { alpha2: "CM", numeric: "120", nom: "Cameroun", gentile: "Camerounais(e)" },
  { alpha2: "CA", numeric: "124", nom: "Canada", gentile: "Canadien(ne)" },
  { alpha2: "TD", numeric: "148", nom: "Tchad", gentile: "Tchadien(ne)" },
  { alpha2: "CL", numeric: "152", nom: "Chili", gentile: "Chilien(ne)" },
  { alpha2: "CN", numeric: "156", nom: "Chine", gentile: "Chinois(e)" },
  { alpha2: "CO", numeric: "170", nom: "Colombie", gentile: "Colombien(ne)" },
  { alpha2: "KM", numeric: "174", nom: "Comores", gentile: "Comorien(ne)" },
  { alpha2: "CG", numeric: "178", nom: "Congo", gentile: "Congolais(e)" },
  { alpha2: "CD", numeric: "180", nom: "Congo (RDC)", gentile: "Congolais(e)" },
  { alpha2: "KR", numeric: "410", nom: "Corée du Sud", gentile: "Sud-Coréen(ne)" },
  { alpha2: "CI", numeric: "384", nom: "Côte d'Ivoire", gentile: "Ivoirien(ne)" },
  { alpha2: "DK", numeric: "208", nom: "Danemark", gentile: "Danois(e)" },
  { alpha2: "DJ", numeric: "262", nom: "Djibouti", gentile: "Djiboutien(ne)" },
  { alpha2: "EG", numeric: "818", nom: "Égypte", gentile: "Égyptien(ne)" },
  { alpha2: "AE", numeric: "784", nom: "Émirats Arabes Unis", gentile: "Émirati(e)" },
  { alpha2: "ES", numeric: "724", nom: "Espagne", gentile: "Espagnol(e)" },
  { alpha2: "US", numeric: "840", nom: "États-Unis", gentile: "Américain(e)" },
  { alpha2: "FR", numeric: "250", nom: "France", gentile: "Français(e)" },
  { alpha2: "GA", numeric: "266", nom: "Gabon", gentile: "Gabonais(e)" },
  { alpha2: "GM", numeric: "270", nom: "Gambie", gentile: "Gambien(ne)" },
  { alpha2: "GH", numeric: "288", nom: "Ghana", gentile: "Ghanéen(ne)" },
  { alpha2: "GN", numeric: "324", nom: "Guinée", gentile: "Guinéen(ne)" },
  { alpha2: "GW", numeric: "624", nom: "Guinée-Bissau", gentile: "Bissau-Guinéen(ne)" },
  { alpha2: "GQ", numeric: "226", nom: "Guinée Équatoriale", gentile: "Équato-guinéen(ne)" },
  { alpha2: "IN", numeric: "356", nom: "Inde", gentile: "Indien(ne)" },
  { alpha2: "ID", numeric: "360", nom: "Indonésie", gentile: "Indonésien(ne)" },
  { alpha2: "IE", numeric: "372", nom: "Irlande", gentile: "Irlandais(e)" },
  { alpha2: "IS", numeric: "352", nom: "Islande", gentile: "Islandais(e)" },
  { alpha2: "IL", numeric: "376", nom: "Israël", gentile: "Israélien(ne)" },
  { alpha2: "IT", numeric: "380", nom: "Italie", gentile: "Italien(ne)" },
  { alpha2: "JP", numeric: "392", nom: "Japon", gentile: "Japonais(e)" },
  { alpha2: "JO", numeric: "400", nom: "Jordanie", gentile: "Jordanien(ne)" },
  { alpha2: "KE", numeric: "404", nom: "Kenya", gentile: "Kényan(ne)" },
  { alpha2: "KW", numeric: "414", nom: "Koweït", gentile: "Koweïtien(ne)" },
  { alpha2: "LB", numeric: "422", nom: "Liban", gentile: "Libanais(e)" },
  { alpha2: "LR", numeric: "430", nom: "Libéria", gentile: "Libérien(ne)" },
  { alpha2: "LY", numeric: "434", nom: "Libye", gentile: "Libyen(ne)" },
  { alpha2: "MG", numeric: "450", nom: "Madagascar", gentile: "Malgache" },
  { alpha2: "ML", numeric: "466", nom: "Mali", gentile: "Malien(ne)" },
  { alpha2: "MA", numeric: "504", nom: "Maroc", gentile: "Marocain(e)" },
  { alpha2: "MU", numeric: "480", nom: "Maurice", gentile: "Mauricien(ne)" },
  { alpha2: "MR", numeric: "478", nom: "Mauritanie", gentile: "Mauritanien(ne)" },
  { alpha2: "MX", numeric: "484", nom: "Mexique", gentile: "Mexicain(e)" },
  { alpha2: "MZ", numeric: "508", nom: "Mozambique", gentile: "Mozambicain(e)" },
  { alpha2: "NE", numeric: "562", nom: "Niger", gentile: "Nigérien(ne)" },
  { alpha2: "NG", numeric: "566", nom: "Nigéria", gentile: "Nigérian(ne)" },
  { alpha2: "NL", numeric: "528", nom: "Pays-Bas", gentile: "Néerlandais(e)" },
  { alpha2: "PK", numeric: "586", nom: "Pakistan", gentile: "Pakistanais(e)" },
  { alpha2: "PE", numeric: "604", nom: "Pérou", gentile: "Péruvien(ne)" },
  { alpha2: "PL", numeric: "616", nom: "Pologne", gentile: "Polonais(e)" },
  { alpha2: "PT", numeric: "620", nom: "Portugal", gentile: "Portugais(e)" },
  { alpha2: "QA", numeric: "634", nom: "Qatar", gentile: "Qatarien(ne)" },
  { alpha2: "GB", numeric: "826", nom: "Royaume-Uni", gentile: "Britannique" },
  { alpha2: "RU", numeric: "643", nom: "Russie", gentile: "Russe" },
  { alpha2: "SN", numeric: "686", nom: "Sénégal", gentile: "Sénégalais(e)" },
  { alpha2: "RS", numeric: "688", nom: "Serbie", gentile: "Serbe" },
  { alpha2: "SG", numeric: "702", nom: "Singapour", gentile: "Singapourien(ne)" },
  { alpha2: "SY", numeric: "760", nom: "Syrie", gentile: "Syrien(ne)" },
  { alpha2: "TJ", numeric: "762", nom: "Tadjikistan", gentile: "Tadjik(e)" },
  { alpha2: "TZ", numeric: "834", nom: "Tanzanie", gentile: "Tanzanien(ne)" },
  { alpha2: "TG", numeric: "768", nom: "Togo", gentile: "Togolais(e)" },
  { alpha2: "TN", numeric: "788", nom: "Tunisie", gentile: "Tunisien(ne)" },
  { alpha2: "TR", numeric: "792", nom: "Turquie", gentile: "Turc/Turque" },
  { alpha2: "UA", numeric: "804", nom: "Ukraine", gentile: "Ukrainien(ne)" },
  { alpha2: "UY", numeric: "858", nom: "Uruguay", gentile: "Uruguayen(ne)" },
  { alpha2: "VE", numeric: "862", nom: "Venezuela", gentile: "Vénézuélien(ne)" },
  { alpha2: "VN", numeric: "704", nom: "Vietnam", gentile: "Vietnamien(ne)" },
  { alpha2: "YE", numeric: "887", nom: "Yémen", gentile: "Yéménite" },
]

export default function ReferentielPaysPage() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 15

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return paysData
    return paysData.filter((item) =>
      [item.alpha2, item.numeric, item.nom, item.gentile].some((value) => value.toLowerCase().includes(q))
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const start = (page - 1) * pageSize
  const paginated = filtered.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

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

        <div className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6 space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-[#eef2f6] px-4 py-3 sm:px-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                  <div className="text-sm font-semibold text-slate-700">Référentiel des pays et nationalités</div>
                  <div className="relative w-full max-w-md ml-auto">
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Rechercher"
                      className="w-full rounded-md border border-slate-300 bg-white px-4 py-2 pr-10 text-sm text-slate-700 shadow-inner outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                    />
                    <HiOutlineSearch className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </div>
                <div className="text-xs text-slate-500">Référentiels</div>
              </div>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-[#e9edf3] text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="w-35 px-4 py-2.5 text-left">N°</th>
                    <th className="w-40 px-4 py-2.5 text-left">Code alpha</th>
                    <th className="w-55 px-4 py-2.5 text-left">Code numérique</th>
                    <th className="px-4 py-2.5 text-left">Nom</th>
                    <th className="px-4 py-2.5 text-left">Nationalité</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p, idx) => (
                    <tr key={`${p.alpha2}-${p.numeric}`} className={`${idx % 2 === 0 ? "bg-white" : "bg-[#f7f8fb]"}`}>
                      <td className="px-4 py-2.5 text-left">{start + idx + 1}</td>
                      <td className="px-4 py-2.5 text-left font-semibold text-slate-800">{p.alpha2}</td>
                      <td className="px-4 py-2.5 text-left">{p.numeric}</td>
                      <td className="px-4 py-2.5 text-left">{p.nom}</td>
                      <td className="px-4 py-2.5 text-left">{p.gentile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-slate-200 bg-[#eef2f6] px-4 py-3">
              <div className="text-xs text-slate-600">Total : {filtered.length}</div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <button
                  className="h-8 w-8 rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B]"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                >
                  {"<<"}
                </button>
                <button
                  className="h-8 w-8 rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B]"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  {"<"}
                </button>
                <span className="rounded-full border border-[#1E4F9B] bg-[#1E4F9B] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                  {page} / {totalPages}
                </span>
                <button
                  className="h-8 w-8 rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B]"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  {">"}
                </button>
                <button
                  className="h-8 w-8 rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B]"
                  onClick={() => setPage(totalPages)}
                  disabled={page === totalPages}
                >
                  {">>"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

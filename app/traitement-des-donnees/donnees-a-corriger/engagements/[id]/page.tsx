'use client'
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import StepTimeline from "@/components/StepTimeline"
import { useEffect, useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { IoCheckmarkCircle, IoClose, IoCloseCircle, IoRadioButtonOn } from "react-icons/io5"

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

const stepLabels = ["Informations engagement", "Garanties", "Échéancier", "Infos complémentaires"]

const garanties = [
  { type: "Hypothèque", valeur: "120 000 000", reference: "GAR-001", date: "2024-01-12" },
  { type: "Caution personnelle", valeur: "50 000 000", reference: "GAR-002", date: "2024-01-12" },
]

const echeances = [
  { numero: 1, date: "30/04/2025", montant: "5 000 000", statut: "À venir" },
  { numero: 2, date: "30/07/2025", montant: "5 000 000", statut: "À venir" },
]

const SectionCard = ({ title, children, error }: { title: string; children: React.ReactNode; error?: string }) => (
  <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
      <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
        <IoRadioButtonOn className="text-blue-500" />
        {title}
      </h3>
      {error ? <IoCloseCircle className="text-red-500" /> : <IoCheckmarkCircle className="text-green-500" />}
    </div>
    <div className="p-4 space-y-3">{children}</div>
    {error ? (
      <div className="bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Liste des erreurs</div>
    ) : null}
  </div>
)

const Field = ({
  label,
  value,
  required = false,
  error,
  success,
}: {
  label: string
  value?: string
  required?: boolean
  error?: string
  success?: boolean
}) => {
  const stateClass = error ? "border-red-400 bg-red-50" : success ? "border-green-400 bg-green-50" : "border-slate-200 bg-white"
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
        {success ? <IoCheckmarkCircle className="text-green-500" /> : null}
      </label>
      <input
        defaultValue={value}
        className={`w-full rounded-md border ${stateClass} px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  )
}

export default function EngagementDetail() {

  const [engagement, setEngagement] = useState<Engagement>({} as Engagement);
  useEffect(() => {
    const data = sessionStorage.getItem('engagementData')
    if (data) {
      const parsed = JSON.parse(data);
      setEngagement({
        ...parsed,
        beneficiaire: parsed.beneficiaire || [],
      });
    }
  }, [])
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [showPieceModal, setShowPieceModal] = useState(false)
  const [showCompteModal, setShowCompteModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const validationIndicators: Record<number, "error" | "success" | undefined> = {
    0: "error",
    1: "error",
    2: "success",
  }

  const timelineSteps = stepLabels.map((label, idx) => ({
    label,
    state: idx < currentStep ? "complete" : idx === currentStep ? "active" : "pending",
    hasError: validationIndicators[idx] === "error",
    hasSuccess: validationIndicators[idx] === "success",
  }))

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

        <div className="flex-1 overflow-y-auto px-4 pb-10 pt-4 sm:px-6 space-y-4">
          <div className="flex flex-col gap-2">
            <div className="text-xs uppercase tracking-wide text-slate-500">Formulaire d’édition d’engagement</div>
            <div className="text-sm font-semibold text-slate-800">Engagement</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <StepTimeline steps={timelineSteps} />
          </div>

          {currentStep === 0 ? (
            <>
              <SectionCard title="Références de l’engagement" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Référence" value={engagement.refIntEng || ""} required success />
                  <Field label="Type d’engagement" value={engagement.typEng || ""} required />
                  <Field label="Montant accordé" value={engagement.mntEng || ""} required />
                  <Field label="Devise" value={engagement.codDev || ""} />
                  <Field label="Date de mise en place" value={engagement.dateMEP || ""} required />
                  <Field label="Taux appliqué" value={engagement.txIntEng || ""} />
                  <Field label="Durée (mois)" value={engagement.periodRemb || ""} />
                  <Field label="Statut" value={engagement.cloture || ""} />
                </div>
              </SectionCard>

              <SectionCard title="Partie prenante" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Client" value={engagement.beneficiaire?.[0]?.IdIntBen || ""} required />
                  <Field label="Identifiant client" value={engagement.beneficiaire?.[0]?.IdIntBen || ""} required />
                  <Field label="Agence" value={engagement.codAgce || ""} />
                  <Field label="Gestionnaire" value="Mamadou Bah" />
                  <Field label="Objet du financement" value="Equipements industriels" />
                </div>
              </SectionCard>
            </>
          ) : currentStep === 1 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Garanties associées</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                  {/* <button
                    type="button"
                    onClick={() => setShowPieceModal(true)}
                    className="rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1a4587]"
                  >
                    Ajouter une garantie
                  </button> */}
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Valeur</th>
                      <th className="px-3 py-2 text-left">Référence</th>
                      <th className="px-3 py-2 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {garanties.map((garantie, idx) => (
                      <tr key={garantie.reference} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{garantie.type}</td>
                        <td className="px-3 py-2">{garantie.valeur}</td>
                        <td className="px-3 py-2">{garantie.reference}</td>
                        <td className="px-3 py-2">{garantie.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Échéancier</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher"
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                    <HiOutlineSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCompteModal(true)}
                    className="rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1a4587]"
                  >
                    Ajouter une échéance
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">N°</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Montant</th>
                      <th className="px-3 py-2 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {echeances.map((echeance, idx) => (
                      <tr key={echeance.numero} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{echeance.numero}</td>
                        <td className="px-3 py-2">{echeance.date}</td>
                        <td className="px-3 py-2">{echeance.montant}</td>
                        <td className="px-3 py-2">{echeance.statut}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentStep === 3 ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Données complémentaires</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Plan de remboursement" />
                    <Field label="Date prochaine revue" />
                    <Field label="Montant restant dû" />
                    <Field label="Gestionnaire risques" />
                  </div>
                  <div>
                    <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
                      Valider
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-md border border-slate-200 bg-white">
                <button className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Tuteur
                </button>
              </div>

              <div className="rounded-md border border-slate-200 bg-white">
                <button className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Employeur
                </button>
              </div>

              <div className="rounded-md border border-slate-200 bg-white">
                <button className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Informations additionnelles
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm text-sm text-slate-600">
              Contenu de l’étape “{stepLabels[currentStep]}” à définir.
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
              className={`rounded-md px-4 py-2 text-sm font-semibold ${currentStep === 0 ? "cursor-not-allowed bg-slate-200 text-slate-500" : "bg-slate-200 text-slate-700 hover:bg-slate-200"}`}
            >
              Précédent
            </button>
            {currentStep === timelineSteps.length - 1 ? (
              <button
                type="button"
                className="rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a4587]"
              >
                Valider cet engagement
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(timelineSteps.length - 1, s + 1))}
                className="rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1a4587]"
              >
                Suivant
              </button>
            )}
          </div>
        </div>

        {showPieceModal ? (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4 py-10">
            <div className="w-full max-w-4xl rounded-lg bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">Informations de garantie</h3>
                <button
                  type="button"
                  onClick={() => setShowPieceModal(false)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                >
                  <IoClose size={18} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Type de garantie" required error="Ce champ est obligatoire" />
                  <Field label="Valeur" required />
                  <Field label="Référence" required />
                  <Field label="Date" required />
                  <Field label="Commentaires" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-4 py-3">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowPieceModal(false)}
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {showCompteModal ? (
          <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 px-4 py-10">
            <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
                <h3 className="text-sm font-semibold text-slate-800">Ajouter une échéance</h3>
                <button
                  type="button"
                  onClick={() => setShowCompteModal(false)}
                  className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                >
                  <IoClose size={18} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="N° échéance" required error="Sélectionnez une valeur" />
                  <Field label="Date" required />
                  <Field label="Montant" required />
                  <Field label="Statut" required />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-4 py-3">
                <button
                  type="button"
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  onClick={() => setShowCompteModal(false)}
                >
                  Fermer
                </button>
                <button
                  type="button"
                  className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}

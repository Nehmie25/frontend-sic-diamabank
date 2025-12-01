'use client'
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import StepTimeline from "@/components/StepTimeline"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { IoCheckmarkCircle, IoClose, IoCloseCircle, IoRadioButtonOn } from "react-icons/io5"

const stepLabels = ["Informations compte", "Titulaire", "Historique", "Infos complémentaires"]

const mouvements = [
  { reference: "MVT-001", date: "2024-02-01", libelle: "Prélèvement", montant: "-1 200 000", agence: "AG-001" },
  { reference: "MVT-002", date: "2024-02-10", libelle: "Intérêts débiteur", montant: "-120 000", agence: "AG-001" },
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

export default function CompteDebiteurDetail() {
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
            <div className="text-xs uppercase tracking-wide text-slate-500">Formulaire d’édition de compte débiteur</div>
            <div className="text-sm font-semibold text-slate-800">Compte débiteur</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <StepTimeline steps={timelineSteps} />
          </div>

          {currentStep === 0 ? (
            <>
              <SectionCard title="Références du compte" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Numéro de compte" value="GN-001-000123" required success />
                  <Field label="Agence" value="AG-001" required />
                  <Field label="Devise" value="GNF" required />
                  <Field label="Date d’ouverture" value="2022-04-15" required />
                  <Field label="Type de compte" value="Compte courant" />
                  <Field label="Statut" value="Ouvert" success />
                </div>
              </SectionCard>

              <SectionCard title="Paramètres débiteurs" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-3">
                  <Field label="Plafond de découvert" value="10 000 000" required />
                  <Field label="Taux intérêt débiteur" value="12%" required />
                  <Field label="Montant des frais" value="150 000" />
                  <Field label="Date de dernière mise à jour" value="2024-02-10" success />
                  <Field label="Référence contrat" value="CONTR-2024-001" />
                </div>
              </SectionCard>
            </>
          ) : currentStep === 1 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Titulaire / signataires</h2>
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
                    onClick={() => setShowPieceModal(true)}
                    className="rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1a4587]"
                  >
                    Ajouter un signataire
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Nom</th>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Identifiant client</th>
                      <th className="px-3 py-2 text-left">Téléphone</th>
                      <th className="px-3 py-2 text-left">Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nom: "Mamadou Bah", type: "Titulaire", identifiant: "CLI-001", tel: "+224620000001", email: "mamadou.bah@banque.gn" },
                      { nom: "Aïssatou Diallo", type: "Co-signataire", identifiant: "CLI-045", tel: "+224622123456", email: "aissatou.diallo@banque.gn" },
                    ].map((signataire, idx) => (
                      <tr key={signataire.identifiant} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{signataire.nom}</td>
                        <td className="px-3 py-2">{signataire.type}</td>
                        <td className="px-3 py-2">{signataire.identifiant}</td>
                        <td className="px-3 py-2">{signataire.tel}</td>
                        <td className="px-3 py-2">{signataire.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Historique des mouvements</h2>
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
                    Ajouter un mouvement
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Référence</th>
                      <th className="px-3 py-2 text-left">Date</th>
                      <th className="px-3 py-2 text-left">Libellé</th>
                      <th className="px-3 py-2 text-left">Montant</th>
                      <th className="px-3 py-2 text-left">Agence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mouvements.map((mvt, idx) => (
                      <tr key={mvt.reference} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{mvt.reference}</td>
                        <td className="px-3 py-2">{mvt.date}</td>
                        <td className="px-3 py-2">{mvt.libelle}</td>
                        <td className="px-3 py-2 text-red-600">{mvt.montant}</td>
                        <td className="px-3 py-2">{mvt.agence}</td>
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
                    <Field label="Plan de régularisation" />
                    <Field label="Date de prochaine échéance" />
                    <Field label="Montant à recouvrer" />
                    <Field label="Responsable recouvrement" />
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
                Valider ce compte débiteur
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
                <h3 className="text-sm font-semibold text-slate-800">Informations de signataire</h3>
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
                  <Field label="Type de signataire" required error="Ce champ est obligatoire" />
                  <Field label="Nom complet" required />
                  <Field label="Identifiant client" required />
                  <Field label="Téléphone" required />
                  <Field label="Email" />
                  <Field label="Pièce d’identité" />
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
                <h3 className="text-sm font-semibold text-slate-800">Ajouter un mouvement</h3>
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
                  <Field label="Référence" required error="Sélectionnez une valeur" />
                  <Field label="Date" required />
                  <Field label="Libellé" required />
                  <Field label="Montant" required />
                  <Field label="Agence" required />
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

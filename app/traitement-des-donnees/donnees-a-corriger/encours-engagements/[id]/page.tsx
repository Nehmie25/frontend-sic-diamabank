'use client'
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import StepTimeline from "@/components/StepTimeline"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { IoCheckmarkCircle, IoClose, IoCloseCircle, IoRadioButtonOn } from "react-icons/io5"

const stepLabels = ["Informations générales", "Pièces d’identités", "Comptes associés", "Infos complémentaires"]

const piecesIdentite = [
  { numero: "123456789", pays: "GN", lieu: "Conakry", dateEmission: "2023-01-01", dateValidite: "2028-01-01" },
  { numero: "0123456789", pays: "XX", lieu: "N/A", dateEmission: "2022-01-01", dateValidite: "2025-01-01" },
]

const comptesAssocies = [
  { numero: "123456789", agence: "AG-001", type: "Compte courant", cleRib: "21", statut: "Actif" },
  { numero: "0123456789", agence: "AG-002", type: "Épargne", cleRib: "10", statut: "Inactif" },
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

export default function PersonnePhysiqueDetail() {
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
            <div className="text-xs uppercase tracking-wide text-slate-500">Formulaire d’édition de personne physique</div>
            <div className="text-sm font-semibold text-slate-800">Personne physique</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <StepTimeline steps={timelineSteps} />
          </div>

          {currentStep === 0 ? (
            <>
              <SectionCard title="Références" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Nature du client" required error="Ce champ peut prendre les valeurs 0 ou 1" />
                  <Field label="Numéro d’identification national" value="12345678" success />
                  <Field label="Numéro client chez le participant" value="12345678901" />
                  <Field label="Date de création" value="2023-12-10" success />
                </div>
              </SectionCard>

              <SectionCard title="Identité" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Nom de naissance du client" value="SYLLA" required error="Champ obligatoire manquant" />
                  <Field label="Prénom du client" value="Mamadou" required />
                  <Field label="Date de naissance" value="2000-01-01" required success />
                  <Field label="Nom marital du client" />
                  <Field label="Sexe du client" value="M" required />
                  <Field label="Nom du client" value="(M)-Masculin" />
                  <Field label="Prénoms du client" value="(Z)-Marié(e)" />
                  <Field label="Pays de résidence" value="Abidjan" />
                  <Field label="Nationalité du client" value="GN" />
                </div>
              </SectionCard>

              <SectionCard title="Adresse" error="Champs obligatoires manquants">
                <div className="grid gap-3 md:grid-cols-5">
                  <Field label="N° de téléphone" value="0022468920014" required error="10/12/14 suivi de 9 chiffres ou +224 suivi de 9 chiffres" />
                  <Field label="Email" required error="Champ obligatoire manquant" />
                  <Field label="Sous tutelle/curelle" />
                  <Field label="Pays de résidence" value="GN" />
                  <Field label="Commune de l’adresse" value="Conakry, Plateau" />
                  <Field label="Adresse" value="Conakry, Plateau" />
                  <Field label="Code postal" required error="Champ obligatoire manquant" />
                </div>
                {/* <div className="mt-3 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Liste des erreurs</div> */}
              </SectionCard>
            </>
          ) : currentStep === 1 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Liste des pièces d’identité</h2>
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
                    Ajouter une pièce
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Numéro de pièce</th>
                      <th className="px-3 py-2 text-left">Pays d’émission</th>
                      <th className="px-3 py-2 text-left">Lieu d’émission</th>
                      <th className="px-3 py-2 text-left">Date d’émission</th>
                      <th className="px-3 py-2 text-left">Date de validité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {piecesIdentite.map((piece, idx) => (
                      <tr key={piece.numero} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{piece.numero}</td>
                        <td className="px-3 py-2">{piece.pays}</td>
                        <td className="px-3 py-2">{piece.lieu}</td>
                        <td className="px-3 py-2">{piece.dateEmission}</td>
                        <td className="px-3 py-2">{piece.dateValidite}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentStep === 2 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Liste des comptes associés</h2>
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
                    Ajouter un compte
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">N°</th>
                      <th className="px-3 py-2 text-left">Agence du compte</th>
                      <th className="px-3 py-2 text-left">Type compte</th>
                      <th className="px-3 py-2 text-left">Numéro de compte</th>
                      <th className="px-3 py-2 text-left">Clé RIB</th>
                      <th className="px-3 py-2 text-left">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comptesAssocies.map((compte, idx) => (
                      <tr key={compte.numero} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">{compte.agence}</td>
                        <td className="px-3 py-2">{compte.type}</td>
                        <td className="px-3 py-2">{compte.numero}</td>
                        <td className="px-3 py-2">{compte.cleRib}</td>
                        <td className="px-3 py-2">{compte.statut}</td>
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
                    <Field label="Revenu mensuel moyen" />
                    <Field label="Dépenses mensuelles moyennes" />
                    <Field label="Propriétaire/Locataire" />
                    <Field label="Nbre de personnes à charge" />
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
                Valider cette personne physique
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
                <h3 className="text-sm font-semibold text-slate-800">Informations de pièce d’identité</h3>
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
                  <Field label="Type de pièce" required error="Ce champ est obligatoire" />
                  <Field label="Numéro de pièce" required />
                  <Field label="Pays émission pièce" required />
                  <Field label="Lieu émission pièce" required />
                  <Field label="Date émission pièce" required error="Ce champ est obligatoire" />
                  <Field label="Date fin validité pièce" required error="Ce champ est obligatoire" />
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
                <h3 className="text-sm font-semibold text-slate-800">Informations de compte associé</h3>
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
                  <Field label="Agence du compte" required error="Sélectionnez une valeur" />
                  <Field label="Type de compte" required />
                  <Field label="N° de compte" required />
                  <Field label="Clé RIB" required />
                  <Field label="Statut du compte" required />
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

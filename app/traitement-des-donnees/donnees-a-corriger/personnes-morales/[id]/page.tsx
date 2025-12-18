'use client'
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import StepTimeline from "@/components/StepTimeline"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { IoCheckmarkCircle, IoClose, IoCloseCircle, IoRadioButtonOn } from "react-icons/io5"

// Page de détail pour une personne morale
// Affiche les informations générales, documents légaux, comptes associés et informations complémentaires

type CompteAssocie = {
  codAgce: string
  numCpt: string
  cleRib: string
  statCpt: string
}

type PersonneMorale = {
  natDec?: string
  natClient?: string
  idInterneClt: string
  denomSocial?: string
  datCreat?: string
  datCreaPart?: string
  statut?: string
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

const stepLabels = ["Informations générales", "Documents légaux", "Comptes associés", "Infos complémentaires"]

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

export default function PersonneMoraleDetail() {
  const params = useParams()
  const idParam = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : ""
  const [personne, setPersonne] = useState<PersonneMorale | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [showPieceModal, setShowPieceModal] = useState(false)
  const [showCompteModal, setShowCompteModal] = useState(false)
  // États pour contrôler l'ouverture des modaux d'ajout (document / compte)
  const [currentStep, setCurrentStep] = useState(0)
  const validationIndicators: Record<number, "error" | "success" | undefined> = {
    0: "error",
    1: "error",
    2: "success",
  }

  useEffect(() => {
    // Charger la personne depuis le sessionStorage si disponible
    // Sinon, rechercher dans la liste sauvegardée (`pm_personnes`)
    if (!idParam || personne) return

    const stored = sessionStorage.getItem("personneMoraleData")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as PersonneMorale
        if (parsed.idInterneClt === idParam) {
          setPersonne(parsed)
          return
        }
      } catch (error) {
        console.error("Erreur lors du parsing de personneMoraleData:", error)
      }
    }

    const savedList = sessionStorage.getItem("pm_personnes")
    if (savedList) {
      try {
        const parsedList = JSON.parse(savedList) as PersonneMorale[]
        const fromList = parsedList.find((p) => p.idInterneClt === idParam)
        if (fromList) {
          setPersonne(fromList)
        }
      } catch (error) {
        console.error("Erreur lors du parsing de pm_personnes:", error)
      }
    }
  }, [idParam, personne])

  const documentsLegaux = useMemo(() => {
    // Construire la liste des documents légaux (RCCM, NIFP) à partir des attributs de la personne
    if (!personne) return []
    const docs = []
    if (personne.rccm) {
      docs.push({
        type: "RCCM",
        numero: personne.rccm,
        pays: personne.paysSiegeSocial || "",
        lieu: personne.villeSiegeSocial || "",
        dateEmission: personne.datCreat || "",
        dateValidite: "",
      })
    }
    if (personne.nifp) {
      docs.push({
        type: "NIFP",
        numero: personne.nifp,
        pays: personne.paysSiegeSocial || "",
        lieu: personne.villeSiegeSocial || "",
        dateEmission: personne.datCreat || "",
        dateValidite: "",
      })
    }
    return docs
  }, [personne])

  const timelineSteps = stepLabels.map((label, idx) => ({
    label,
    // Assurer le typage explicite pour `state` (StepState)
    state: (idx < currentStep ? "complete" : idx === currentStep ? "active" : "pending") as "complete" | "active" | "pending",
    hasError: validationIndicators[idx] === "error",
    hasSuccess: validationIndicators[idx] === "success",
  }))

  // Indique si aucune personne n'est chargée (état vide)
  const emptyState = !personne

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
            <div className="text-xs uppercase tracking-wide text-slate-500">Formulaire d’édition de personne morale</div>
            <div className="text-sm font-semibold text-slate-800">Personne morale</div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <StepTimeline steps={timelineSteps} />
          </div>

          {emptyState ? (
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm text-sm text-slate-700">
              Aucune donnée chargée pour cette personne morale. Retournez à la liste et ouvrez à nouveau le détail.
            </div>
          ) : currentStep === 0 ? (
            <>
              <SectionCard title="Références légales" error={!personne ? "Données manquantes" : undefined}>
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Nature du client" value={personne?.natClient} required />
                  <Field label="Nature déclaration" value={personne?.natDec} />
                  <Field label="Id interne client" value={personne?.idInterneClt} />
                  <Field label="Date de constitution" value={personne?.datCreat} />
                  <Field label="Date de création participant" value={personne?.datCreaPart} />
                  <Field label="Statut" value={personne?.statut} />
                  <Field label="Situation bancaire" value={personne?.sitBancaire} />
                  <Field label="Secteur institution" value={personne?.sectInst} />
                  <Field label="RCCM / Registre du commerce" value={personne?.rccm} />
                  <Field label="N° identification fiscale" value={personne?.nifp} />
                </div>
              </SectionCard>

              <SectionCard title="Identité de la société" error={!personne ? "Données manquantes" : undefined}>
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Raison sociale" value={personne?.denomSocial} required />
                  <Field label="Forme juridique" value={personne?.formeJuridique} />
                  <Field label="Activité économique" value={personne?.actEcon} />
                  <Field label="Pays du siège" value={personne?.paysSiegeSocial} />
                  <Field label="Ville du siège" value={personne?.villeSiegeSocial} />
                  <Field label="Résident" value={personne?.resident} />
                  <Field label="Nature client" value={personne?.natClient} />
                  <Field label="Nature déclaration" value={personne?.natDec} />
                </div>
              </SectionCard>

              <SectionCard title="Adresse et contacts" error={!personne ? "Données manquantes" : undefined}>
                <div className="grid gap-3 md:grid-cols-5">
                  <Field label="Téléphone siège" value={personne?.mobile} />
                  <Field label="Email" value={personne?.email} />
                  <Field label="Adresse" value={personne?.adress} />
                  <Field label="Code postal" value={personne?.codePostal} />
                  <Field label="Pays" value={personne?.paysSiegeSocial} />
                  <Field label="Ville" value={personne?.villeSiegeSocial} />
                  <Field label="Résident" value={personne?.resident} />
                </div>
              </SectionCard>
            </>
          ) : currentStep === 1 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Documents légaux</h2>
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
                    Ajouter un document
                  </button>
                </div>
              </div>
              <div className="overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                    <tr>
                      <th className="px-3 py-2 text-left">Type de document</th>
                      <th className="px-3 py-2 text-left">Numéro de pièce</th>
                      <th className="px-3 py-2 text-left">Pays d’émission</th>
                      <th className="px-3 py-2 text-left">Lieu d’émission</th>
                      <th className="px-3 py-2 text-left">Date d’émission</th>
                      <th className="px-3 py-2 text-left">Date de validité</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documentsLegaux.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                          Aucun document disponible
                        </td>
                      </tr>
                    ) : (
                      documentsLegaux.map((piece, idx) => (
                        <tr key={piece.numero} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                          <td className="px-3 py-2">{piece.type}</td>
                          <td className="px-3 py-2">{piece.numero}</td>
                          <td className="px-3 py-2">{piece.pays}</td>
                          <td className="px-3 py-2">{piece.lieu}</td>
                          <td className="px-3 py-2">{piece.dateEmission}</td>
                          <td className="px-3 py-2">{piece.dateValidite}</td>
                        </tr>
                      ))
                    )}
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
                    {personne?.compteAssocie?.length ? (
                      personne.compteAssocie.map((compte, idx) => (
                        <tr
                          key={`${compte.codAgce}-${compte.numCpt}-${idx}`}
                          className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}
                        >
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2">{compte.codAgce}</td>
                          <td className="px-3 py-2">-</td>
                          <td className="px-3 py-2">{compte.numCpt}</td>
                          <td className="px-3 py-2">{compte.cleRib}</td>
                          <td className="px-3 py-2">{compte.statCpt}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                          Aucun compte associé
                        </td>
                      </tr>
                    )}
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
                    <Field label="Chiffre d’affaires annuel" />
                    <Field label="Nombre d’employés" />
                    <Field label="Forme de propriété" />
                    <Field label="Agence de rattachement" />
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
                  Actionnaires
                </button>
              </div>

              <div className="rounded-md border border-slate-200 bg-white">
                <button className="w-full px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Dirigeants
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
                Valider cette personne morale
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
                <h3 className="text-sm font-semibold text-slate-800">Informations de document légal</h3>
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
                  <Field label="Type de document" required error="Ce champ est obligatoire" />
                  <Field label="Numéro de document" required />
                  <Field label="Pays d’émission" required />
                  <Field label="Lieu d’émission" required />
                  <Field label="Date d’émission" required error="Ce champ est obligatoire" />
                  <Field label="Date de validité" required error="Ce champ est obligatoire" />
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

'use client'
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import StepTimeline from "@/components/StepTimeline"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { IoCheckmarkCircle, IoClose, IoCloseCircle, IoRadioButtonOn } from "react-icons/io5"
import { IoArrowBack } from "react-icons/io5"


type PersonnePhysique = {
  id: number
  natureClient: string
  identifiant: string
  nom: string
  prenom: string
  sexe: string
  dateNaissance: string
  lieuNaissance: string
  paysNaissance: string
  adresse: string
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
  donneeComplementaire?: Array<{
    nbPersCharge: string
    revMensMoy: string
    depMensMoy: string
    propLoc: string
  }>
  employeur?: Array<{
    idInterneEmpl: string
    denominationSociale: string
    rccm: string
    nif: string
    nifp: string
    dateCreation: string
    dateEntree: string
  }>
}


const stepLabels = ["Informations générales", "Pièces d’identités", "Comptes associés", "Infos complémentaires"]

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

const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr || ""
  return `${dateStr.slice(0, 2)}-${dateStr.slice(2, 4)}-${dateStr.slice(4, 8)}`
}

export default function PersonnePhysiqueDetail() {

  const router = useRouter()
  const [personne, setPersonne] = useState<PersonnePhysique | null>(null)

  useEffect(() => {
    const data = sessionStorage.getItem('personneData')
    if (data) {
      setPersonne(JSON.parse(data))
    }
  }, [])

  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [currentStep, setCurrentStep] = useState(0)
  const validationIndicators: Record<number, "error" | "success" | undefined> = {
    0: "success",
    1: "success",
    2: "success",
    3: "success",
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="rounded-md p-2 bg-white text-slate-600 hover:bg-slate-100 transition-colors shadow-sm"
              title="Retour à la page précédente"
            >
              <IoArrowBack size={20} />
            </button>
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wide text-slate-500">Formulaire de personne physique</div>
              <div className="text-sm font-semibold text-slate-800">Personne physique</div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white px-4 py-4 shadow-sm">
            <StepTimeline steps={timelineSteps} />
          </div>

          {currentStep === 0 ? (
            <>
              <SectionCard title="Références">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Nature déclaration" value={personne?.natDec} required error={personne?.natDec && personne?.natDec !== "00" && personne?.natDec !== "01" ? "Ce champ peut prendre les valeurs 00 ou 01" : undefined} success={personne?.natDec === "00" || personne?.natDec === "01"} />
                  <Field label="Nature du client" value={personne?.natureClient} required error={(personne?.natureClient && personne?.natureClient !== '0' && personne?.natureClient !== '1') ? "Ce champ peut prendre les valeurs 0 ou 1" : undefined} success={(personne?.natureClient == '0' || personne?.natureClient == '1')} />
                  <Field label="Numéro d’identification national" value="12345678" success />
                  <Field label="Numéro client chez le participant" value={personne?.idInterneClt || ""} error={personne?.idInterneClt === "" ? "Ce champ est obligatoire" : undefined} success={personne?.idInterneClt !== ""} />
                  <Field label="Date de création chez le participant" value={formatDate(personne?.datCreaPart)} success={personne?.datCreaPart !== "" && personne?.datCreaPart !== undefined} error={!personne?.datCreaPart ? "Ce champ doit être obligatoire" : undefined} />
                </div>
              </SectionCard>

              <SectionCard title="Identité">
                <div className="grid gap-3 md:grid-cols-4">
                  <Field label="Nom de naissance du client" value={personne?.nomNaiClt || ""} success={personne?.nomNaiClt !== "" && personne?.nomNaiClt !== undefined} error={personne?.nomNaiClt === "" ? "Ce champ est obligatoire" : undefined} />
                  <Field label="Prénom du client" value={personne?.prenomClt || ""} success={personne?.prenomClt !== "" && personne?.prenomClt !== undefined} error={personne?.prenomClt === "" ? "Ce champ est obligatoire" : undefined} />
                  <Field label="Date de naissance" value={formatDate(personne?.dateNaissance || "")} success={personne?.dateNaissance !== "" && personne?.dateNaissance !== undefined} error={personne?.dateNaissance === "" ? "Ce champ est obligatoire" : undefined} />
                  <Field label="Nom marital du client" />
                  <Field label="Sexe du client" value={personne?.sexe || ""}  error={personne?.sexe == "" ? "Ce champ est obligatoire" : undefined} success={personne?.sexe != ""} />
                  <Field label="Etat civile" value={personne?.etatCivil || ""} success={personne?.etatCivil !== "" && personne?.etatCivil !== undefined} error={personne?.etatCivil === "" ? "Ce champ est obligatoire" : undefined} />
                  <Field label="Pays de résidence" value={personne?.paysNaissance || ""} />
                  <Field label="Nationalité du client" value={personne?.paysNaissance || ""} />
                </div>
              </SectionCard>

              <SectionCard title="Adresse">
                <div className="grid gap-3 md:grid-cols-5">
                  <Field label="N° de téléphone" value={personne?.mobile || ""} success={personne?.mobile !== "" && personne?.mobile !== undefined} error={personne?.mobile === "" ? "Ce champ est obligatoire" : undefined} />
                  <Field label="Sous tutelle/curelle" />
                  <Field label="Pays de résidence" value="GN" />
                  <Field label="Commune de l’adresse" value="Conakry, Plateau" />
                  <Field label="Adresse" value={personne?.adresse || ""} success={personne?.adresse !== "" && personne?.adresse !== undefined} error={personne?.adresse === "" ? "Ce champ est obligatoire" : undefined} />
                  <Field label="Code postal" required  />
                </div>
                {/* <div className="mt-3 rounded-md bg-red-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white">Liste des erreurs</div> */}
              </SectionCard>
            </>
          ) : currentStep === 1 ? (
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-base font-semibold text-slate-800">Liste des pièces d’identité</h2>
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
                    {!personne?.piece || personne?.piece?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-2 text-center text-slate-600">
                          Aucune pièce d'identité disponible.
                        </td>
                      </tr>
                    ) : personne?.piece?.map((piece, idx) => (
                      <tr key={piece.numPiece} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{piece.numPiece}</td>
                        <td className="px-3 py-2">{piece.paysEmiPiece}</td>
                        <td className="px-3 py-2">{piece.lieuEmiPiece}</td>
                        <td className="px-3 py-2">{formatDate(piece.datEmiPiece)}</td>
                        <td className="px-3 py-2">{formatDate(piece.finValPiece)}</td>
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
                    {personne?.compteAssocie === undefined || personne?.compteAssocie.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-3 py-2 text-center text-slate-600">
                          Aucun compte associé disponible.
                        </td>
                      </tr>
                    ) : personne?.compteAssocie?.map((compte, idx) => (
                      <tr key={compte.numCpt} className={`${idx % 2 === 0 ? "bg-[#f9eaea]" : "bg-white"} hover:bg-blue-50`}>
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">{compte.codAgce}</td>
                        <td className="px-3 py-2">{compte.typCpt}</td>
                        <td className="px-3 py-2">{compte.numCpt}</td>
                        <td className="px-3 py-2">{compte.cleRib}</td>
                        <td className="px-3 py-2">{compte.statCpt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : currentStep === 3 ? (
            <div className="space-y-4">
              {personne?.donneeComplementaire && personne.donneeComplementaire.length > 0 ? (
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
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-6 shadow-sm text-sm text-slate-600 text-center">
                  Aucune donnée complémentaire disponible.
                </div>
              )}


              {/* <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Tuteur</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Revenu mensuel moyen" />
                    <Field label="Dépenses mensuelles moyennes" />
                    <Field label="Propriétaire/Locataire" />
                    <Field label="Nbre de personnes à charge" />
                  </div>
                </div>
              </div> */}

              {personne?.employeur && personne.employeur.length > 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 px-4 py-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Employeur</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Revenu mensuel moyen" />
                      <Field label="Dépenses mensuelles moyennes" />
                      <Field label="Propriétaire/Locataire" />
                      <Field label="Nbre de personnes à charge" />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-4 py-3">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-700">Informations additionnelles</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="grid gap-3 md:grid-cols-2">
                    <Field label="Revenu mensuel moyen" />
                    <Field label="Dépenses mensuelles moyennes" />
                    <Field label="Propriétaire/Locataire" />
                    <Field label="Nbre de personnes à charge" />
                  </div>
                </div>
              </div> */}

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
                disabled
                className="rounded-md bg-slate-300 px-4 py-2 text-sm font-semibold text-slate-500 cursor-not-allowed"
              >
                Finalisation
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
      </main>
    </div>
  )
}

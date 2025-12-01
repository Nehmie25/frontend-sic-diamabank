'use client'
import Image from "next/image"
import type { ComponentType } from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AiFillDatabase, AiOutlineStop } from "react-icons/ai"
import { BsPen } from "react-icons/bs"
import { CiCreditCard1 } from "react-icons/ci"
import { FaDesktop } from "react-icons/fa"
import { FaRegShareFromSquare } from "react-icons/fa6"
import { ImUsers } from "react-icons/im"
import { IoChevronDown, IoHomeOutline, IoMenu, IoPersonCircleOutline } from "react-icons/io5"
import { LiaInfinitySolid } from "react-icons/lia"
import { LuDatabase } from "react-icons/lu"
import { MdOutlineSettings } from "react-icons/md"
import { SlDisc } from "react-icons/sl"

type LinkItem = {
  icon: ComponentType<{ className?: string }>
  label: string
  chevron?: boolean
  subLinks?: SubLink[]
  href?: string
}

type SubLink = {
  label: string
  href?: string
}

type Section = {
  title: string
  links: LinkItem[]
}

type SidebarProps = {
  isOpen?: boolean
  onClose?: () => void
}

const sections: Section[] = [
  {
    title: "Tableau de bord",
    links: [{ icon: FaDesktop, label: "Tableau de bord", href: "/" }],
  },
  {
    title: "Traitement des données",
    links: [
      { icon: SlDisc, label: "Récupération des données", chevron: true },
      {
        icon: AiOutlineStop,
        label: "Données chargées à corriger",
        chevron: true,
        subLinks: [
          { label: "Personnes physiques", href: "/traitement-des-donnees/donnees-a-corriger/personnes-physiques" },
          { label: "Personnes morales", href: "/traitement-des-donnees/donnees-a-corriger/personnes-morales" },
          { label: "Comptes débiteurs", href: "/traitement-des-donnees/donnees-a-corriger/comptes-debiteurs" },
          { label: "Engagements", href: "/traitement-des-donnees/donnees-a-corriger/engagements" },
          { label: "Encours d'engagements" },
        ],
      },
    ],
  },
  {
    title: "Déclaration",
    links: [
      { icon: SlDisc, label: "Validation des déclarations", chevron: true },
      { icon: SlDisc, label: "Supervalidation des déclarations", chevron: true },
      { icon: AiFillDatabase, label: "Données à générer", chevron: true },
      { icon: LuDatabase, label: "Suivi des générations", chevron: true },
    ],
  },
  {
    title: "Suivi des déclarations",
    links: [
      {
        icon: IoPersonCircleOutline,
        label: "Personnes physiques",
        chevron: true,
        subLinks: [
          { label: "Envoyées vers la centrale" },
          { label: "Acceptées par la centrale" },
          { label: "Rejetées par la centrale" },
        ],
      },
      { icon: IoHomeOutline, label: "Personnes morales", chevron: true },
      { icon: CiCreditCard1, label: "Comptes débiteurs", chevron: true },
      { icon: BsPen, label: "Engagements", chevron: true },
      { icon: LiaInfinitySolid, label: "Encours d'engagement", chevron: true },
    ],
  },
  {
    title: "Reporting",
    links: [{ icon: FaRegShareFromSquare, label: "Reporting" }],
  },
  {
    title: "Administration",
    links: [
      {
        icon: ImUsers,
        label: "Gestion des utilisateurs",
        chevron: true,
        subLinks: [
          { label: "Compte utilisateurs" , href: "/administration/compte-utilisateur"},
          { label: "Utilisateurs bloqués" },
        ]
      },
      {
        icon: MdOutlineSettings,
        label: "Gestion des referentiels",
        chevron: true,
        subLinks: [
          { label: "Participants" },
          { label: "Catégories d’IMFs" },
          { label: "Pays & Nationalités" },
          { label: "Secteurs d’activités" },
          { label: "Secteurs institutionnels" },
          { label: "Agences" },
          { label: "Formes juridiques des PM" },
          { label: "Qualité des mandataires" },
          { label: "Type, Nature et catégorie engage" },
          { label: "Périodicité engagement" },
          { label: "Termes engagement banques" },
          { label: "Termes engagement IMF" },
          { label: "Moyens de remboursement" },
          { label: "FNatures et type garanties" },
          { label: "Types identifiant garanties" },
          { label: "Qualité créance banque" },
          { label: "Qualité créance IMF" }
        ]
      }
    ],
  },
]

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null)
  const [activeSub, setActiveSub] = useState<string>("")
  const pathname = usePathname()
  const router = useRouter()
  const closeIfMobile = () => {
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches) {
      onClose?.()
    }
  }

  const matchesPath = (target?: string) => {
    if (!target) return false
    return pathname === target || pathname.startsWith(`${target}/`)
  }

  useEffect(() => {
    let matchedParent: string | null = null
    let matchedSub: string | null = null

    sections.forEach((section) => {
      section.links.forEach((link) => {
        if (!link.subLinks) return
        const sub = link.subLinks.find((item) => matchesPath(item.href))
        if (sub) {
          matchedParent = link.label
          matchedSub = sub.label
        }
      })
    })

    if (matchedParent) setOpenItem(matchedParent)
    if (matchedSub) setActiveSub(matchedSub)
  }, [pathname])

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex h-full w-72 flex-col border-r border-slate-200 bg-white/98 shadow-[4px_0_18px_-14px_rgba(0,0,0,0.4)] backdrop-blur transition-transform duration-200 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-white to-slate-50">
        <div className="flex items-center justify-center h-12 w-12 rounded-xl border border-blue-100 bg-blue-50 shadow-sm">
          <Image src="/cashback.png" alt="Diamabank" width={32} height={32} className="h-8 w-8" priority />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800">Diamabank</p>
          <p className="text-xs text-slate-500">Backoffice</p>
        </div>
        <button
          onClick={closeIfMobile}
          className="btn btn-ghost btn-sm text-slate-600 md:hidden"
        >
          <IoMenu size={22} />
        </button>
      </div>

      <div className="flex-1 space-y-7 px-5 py-6 overflow-y-auto bg-gradient-to-b from-white via-white to-slate-50/60">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              {section.title}
            </div>
            <ul className="space-y-1 text-sm text-slate-700">
              {section.links.map((link) => {
                const isOpen = openItem === link.label && link.subLinks
                const hasActiveChild = link.subLinks?.some((sub) => matchesPath(sub.href))
                const isActiveLink = matchesPath(link.href) || hasActiveChild
                return (
                  <li key={link.label} className="space-y-1">
                    {link.subLinks ? (
                      <button
                        type="button"
                        onClick={() => setOpenItem(isOpen ? null : link.label)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isActiveLink
                            ? "bg-[#ECF3FF] text-[#1E4F9B] font-semibold"
                            : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        <link.icon className="text-base" />
                        <span className="flex-1 text-[13px] font-medium">{link.label}</span>
                        <IoChevronDown
                          className={`text-xs text-slate-400 transition-transform ${isOpen ? "-rotate-180" : "rotate-0"}`}
                        />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (link.href) {
                            router.push(link.href)
                            closeIfMobile()
                          }
                        }}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isActiveLink
                            ? "bg-[#ECF3FF] text-[#1E4F9B] font-semibold"
                            : "hover:bg-blue-50 hover:text-blue-700"
                        }`}
                      >
                        <link.icon className="text-base" />
                        <span className="flex-1 text-[13px] font-medium">{link.label}</span>
                        {link.chevron ? <IoChevronDown className="text-xs text-slate-400" /> : null}
                      </button>
                    )}

                    {isOpen ? (
                      <div className="ml-6 mt-1 border-l-4 border-blue-700 pl-3 space-y-1">
                        {link.subLinks.map((sub) => {
                          const isActive = matchesPath(sub.href) || activeSub === sub.label
                          return (
                            <button
                              type="button"
                              key={sub.label}
                              onClick={() => {
                                setActiveSub(sub.label)
                                if (sub.href) {
                                  router.push(sub.href)
                                  closeIfMobile()
                                }
                              }}
                              className={`w-full rounded-md px-2 py-1.5 text-left text-[13px] transition-colors ${isActive ? "bg-[#ECF3FF] font-semibold text-slate-800" : "hover:bg-blue-50 hover:text-blue-700"
                                }`}
                            >
                              {sub.label}
                            </button>
                          )
                        })}
                      </div>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar

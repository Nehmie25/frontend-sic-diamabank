'use client'

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CiSettings } from "react-icons/ci"
import { IoChevronDown, IoMenu } from "react-icons/io5"
import { HiOutlineBell } from "react-icons/hi2"
import { FiLogOut } from "react-icons/fi"
import Image from "next/image"

const sessionData = [
  { label: "Date Session", value: "26/02/2024" },
  { label: "Date Arrêté", value: "26/02/2024" },
  { label: "Monitoring", value: "En cours", withChevron: true },
]

type NavbarProps = {
  onToggleSidebar?: () => void
}

const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const [openProfile, setOpenProfile] = useState(false)
  const profileRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setOpenProfile(false)
      }
    }
    if (openProfile) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openProfile])

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-white px-6 py-3 shadow-sm border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onToggleSidebar?.()}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 md:hidden"
        >
          <IoMenu size={20} />
        </button>

        <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-200 bg-blue-600 text-white shadow-md">
          <CiSettings size={22} />
        </button>
        <div className="flex items-stretch gap-3 overflow-x-auto">
          {sessionData.map((item) => (
            <div
              key={item.label}
              className="flex min-w-[155px] flex-col justify-center rounded-md border border-slate-200 bg-slate-50 px-4 py-2 shadow-[0_6px_20px_-18px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-800">{item.value}</span>
                {item.withChevron ? <IoChevronDown className="text-slate-500" /> : null}
              </div>
              <span className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div ref={profileRef} className="relative flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:text-slate-700">
          <HiOutlineBell size={20} />
          <span className="absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-orange-400" />
        </button>

        <button
          type="button"
          onClick={() => setOpenProfile((v) => !v)}
          className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-slate-50"
        >
          <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 shadow-sm">
            <Image src="/profile.png" alt="Profil" width={40} height={40} className="h-full w-full object-cover" />
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-slate-800">
            Musharof
            <IoChevronDown className={`text-slate-500 transition-transform ${openProfile ? "-rotate-180" : "rotate-0"}`} />
          </div>
        </button>

        {openProfile ? (
          <div className="absolute right-0 top-14 w-64 rounded-xl border border-slate-100 bg-white p-4 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.35)]">
            <div className="mb-4">
              <p className="text-sm font-semibold text-slate-800">Musharof Chowdhury</p>
              <p className="text-xs text-slate-500">randomuser@pimjo.com</p>
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                <span className="text-base">👤</span>
                <span>Modifier le profil</span>
              </button>
              <button className="flex w-full items-center gap-3 rounded-lg px-2 py-2 hover:bg-slate-50">
                <span className="text-base">⚙️</span>
                <span>Paramètre</span>
              </button>
              <div className="h-px bg-slate-200" />
              <button
                type="button"
                onClick={() => {
                  setOpenProfile(false)
                  router.push("/connexion")
                }}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="text-base" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Navbar

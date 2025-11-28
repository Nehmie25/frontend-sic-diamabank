'use client'

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"

const metrics = [
  "Déclarations",
  "Correction",
  "Validations",
  "Supervalidation",
  "Générations",
  "Rejets",
  "Acquittements",
]

const sections = [
  { title: "Personne Physique", total: 0, highlightValidations: true },
  { title: "Personne Morale", total: 0 },
  { title: "Engagement", total: 0 },
  { title: "Encours d'engagement", total: 0 },
  { title: "Compte débiteurs", total: 0 },
]

const DashboardSection = ({
  title,
  total,
  highlightValidations,
}: {
  title: string
  total: number
  highlightValidations?: boolean
}) => (
  <div className="overflow-hidden rounded-md border border-blue-200/70 bg-white shadow-[0_10px_40px_-30px_rgba(38,67,138,0.6)]">
    <div className="flex items-center justify-between bg-gradient-to-r from-white to-slate-50 px-5 py-3 border-b border-blue-100/70">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 rounded-full bg-blue-600 shadow-[0_0_0_3px_rgba(37,99,235,0.15)]" />
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-700">{title}</p>
      </div>
      <span className="rounded-full bg-red-500 px-3 py-1 text-[11px] font-semibold uppercase text-white shadow-sm">
        Total: {total}
      </span>
    </div>
    <div className="grid grid-cols-7 divide-x divide-blue-100/60">
      {metrics.map((metric) => {
        const isHighlight = highlightValidations && metric === "Validations"
        return (
          <div
            key={metric}
            className={`flex flex-col items-center justify-center gap-2 bg-white py-6 text-slate-700 transition-transform ${
              isHighlight ? "relative z-[1] scale-[1.01] shadow-[0_16px_48px_-28px_rgba(0,0,0,0.6)]" : "hover:-translate-y-0.5"
            }`}
          >
            <span className="text-3xl font-semibold text-slate-800">0</span>
            <span className="text-[11px] uppercase tracking-wide text-slate-500">{metric}</span>
          </div>
        )
      })}
    </div>
  </div>
)

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )

  const handleToggleSidebar = () => setSidebarOpen((prev) => !prev)

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800">
      <aside className="fixed left-0 top-0 h-full">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </aside>

      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <main
        className="flex min-h-screen flex-col transition-all duration-200 md:ml-72"
      >
        <Navbar onToggleSidebar={handleToggleSidebar} />
        <div className="flex-1 overflow-y-auto px-4 pb-10 pt-6 space-y-6 sm:px-6">
          {sections.map((section) => (
            <DashboardSection
              key={section.title}
              title={section.title}
              total={section.total}
              highlightValidations={section.highlightValidations}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard

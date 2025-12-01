'use client'

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { useState } from "react"
import { HiOutlineSearch } from "react-icons/hi"
import { IoClose } from "react-icons/io5"

type Utilisateur = {
  id: number
  nom: string
  prenoms: string
  telephone: string
  login: string
  email: string
  statut: string
}

const initialUsers: Utilisateur[] = []

const emptyForm = {
  nom: "",
  prenoms: "",
  telephone: "",
  login: "",
  email: "",
  statut: "Bloqué",
}

export default function UtilisateursBloquesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [search, setSearch] = useState("")
  const [blockedUsers, setBlockedUsers] = useState<Utilisateur[]>(initialUsers)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const filteredUsers = blockedUsers.filter((user) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [user.nom, user.prenoms, user.telephone, user.login, user.email, user.statut].some((value) =>
      value.toLowerCase().includes(q)
    )
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { nom, prenoms, telephone, login, email } = form
    if (!nom || !prenoms || !telephone || !login || !email) return
    const newUser: Utilisateur = {
      ...form,
      id: Date.now(),
    }
    setBlockedUsers((prev) => [...prev, newUser])
    setForm(emptyForm)
    setShowModal(false)
  }

  const handleRefresh = () => {
    setBlockedUsers(initialUsers)
    setSearch("")
  }

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

        <div className="flex-1 overflow-auto px-4 pb-10 pt-6 sm:px-6">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center gap-4 border-b border-slate-200 bg-[#eef2f6] px-4 py-3 sm:gap-6 sm:px-6">
              <h1 className="text-base font-semibold text-[#1f3c6d]">Liste des utilisateurs bloqués</h1>

              <div className="flex flex-1 justify-center">
                <div className="relative w-full max-w-xl">
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

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="ml-auto rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#163c78]"
              >
                Nouvel utilisateur
              </button>
            </div>

            <div className="overflow-x-auto px-4 py-4 sm:px-6 sm:py-6">
              <table className="min-w-full border border-slate-200 text-sm">
                <thead className="bg-[#f3f6fb] text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="w-14 border border-slate-200 px-3 py-2 text-center">N°</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Nom</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Prénoms</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Téléphone</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">login</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">E mail</th>
                    <th className="border border-slate-200 px-3 py-2 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className={`${idx % 2 === 0 ? "bg-[#f5f7fb]" : "bg-white"} text-slate-700`}>
                      <td className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800">{idx + 1}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.nom}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.prenoms}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.telephone}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.login}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.email}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.statut}</td>
                    </tr>
                  ))}

                  {!filteredUsers.length ? (
                    <tr>
                      <td className="px-3 py-10 text-center text-slate-500" colSpan={7}>
                        <div className="flex flex-col items-center gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wide">Aucune donnée trouvée</span>
                          <button
                            type="button"
                            onClick={handleRefresh}
                            className="rounded-full bg-[#1E4F9B] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#163c78]"
                          >
                            Actualiser
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">Ajouter un utilisateur bloqué</h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Fermer"
              >
                <IoClose size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Nom</label>
                  <input
                    required
                    value={form.nom}
                    onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Prénoms</label>
                  <input
                    required
                    value={form.prenoms}
                    onChange={(e) => setForm((f) => ({ ...f, prenoms: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Téléphone</label>
                  <input
                    required
                    value={form.telephone}
                    onChange={(e) => setForm((f) => ({ ...f, telephone: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Login</label>
                  <input
                    required
                    value={form.login}
                    onChange={(e) => setForm((f) => ({ ...f, login: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">E-mail</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Statut</label>
                  <input
                    value={form.statut}
                    onChange={(e) => setForm((f) => ({ ...f, statut: e.target.value }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#1E4F9B] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#163c78]"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}

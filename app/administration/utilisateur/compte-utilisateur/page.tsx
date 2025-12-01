'use client'

import { useState } from "react"
import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { HiOutlineSearch } from "react-icons/hi"
import { IoCheckmarkCircle, IoChevronDown, IoClose, IoCloseCircle } from "react-icons/io5"
import { FaLock, FaUnlockAlt } from "react-icons/fa"
import { MdPassword } from "react-icons/md"

type Utilisateur = {
  id: number
  nom: string
  prenoms: string
  telephone: string
  login: string
  email: string
  actif: boolean
}

const utilisateurs: Utilisateur[] = [
  { id: 1, nom: "AAA", prenoms: "BBS", telephone: "1020309200", login: "bkaba", email: "bintou.kaba@xxxbanque.com", actif: false },
  { id: 2, nom: "AAA", prenoms: "BBS", telephone: "0020202020", login: "mbah", email: "mohamed.bah@xxxbanque.com", actif: false },
  { id: 3, nom: "AAA", prenoms: "BWB", telephone: "38299892719", login: "hcamara", email: "hewa.camara@xxxbanque.com", actif: false },
  { id: 4, nom: "AAA", prenoms: "BBS", telephone: "28792129", login: "ba", email: "ba@xxx.gn", actif: false },
  { id: 5, nom: "AAA", prenoms: "BBS", telephone: "2027227221", login: "bb", email: "thiam@xxx.gn", actif: false },
  { id: 6, nom: "AAA", prenoms: "BMB", telephone: "38393939", login: "kk", email: "kk@xxx.gn", actif: false },
  { id: 7, nom: "AAA", prenoms: "BBS", telephone: "3339939339", login: "ddd", email: "riba@xxx.gn", actif: false },
  { id: 8, nom: "AAA", prenoms: "BBA", telephone: "484948418", login: "ee", email: "rbah@xxx.gn", actif: false },
  { id: 9, nom: "USER TEST", prenoms: "UT TEST", telephone: "22501010101", login: "lorem", email: "lorem@lipsum.com", actif: true },
  { id: 10, nom: "AAA", prenoms: "BBS", telephone: "969696969", login: "mylla", email: "moustapha.sylla@xxxbanque.com", actif: false },
]

const UsersPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(
    typeof window !== "undefined" ? window.matchMedia("(min-width: 768px)").matches : false
  )
  const [search, setSearch] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState<Utilisateur[]>(utilisateurs)
  const [form, setForm] = useState({ nom: "", prenoms: "", telephone: "", login: "", email: "", actif: true })

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase()
    if (!query) return true
    return [user.nom, user.prenoms, user.telephone, user.login, user.email].some((value) =>
      value.toLowerCase().includes(query)
    )
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { nom, prenoms, telephone, login, email } = form
    if (!nom || !prenoms || !telephone || !login || !email) return
    const newUser: Utilisateur = { ...form, id: Date.now() }
    setUsers((prev) => [...prev, newUser])
    setForm({ nom: "", prenoms: "", telephone: "", login: "", email: "", actif: true })
    setShowModal(false)
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
              <h1 className="text-base font-semibold text-[#1f3c6d]">Liste des utilisateurs</h1>

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
                    <th className="w-12 border border-slate-200 px-3 py-2 text-center">status</th>
                    <th className="border border-slate-200 px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, idx) => (
                    <tr key={user.id} className={`${idx % 2 === 0 ? "bg-[#f5f7fb]" : "bg-white"} text-slate-700`}>
                      <td className="border border-slate-200 px-3 py-2 text-center font-semibold text-slate-800">{user.id}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.nom}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.prenoms}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.telephone}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.login}</td>
                      <td className="border border-slate-200 px-3 py-2">{user.email}</td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        {user.actif ? (
                          <IoCheckmarkCircle className="mx-auto text-lg text-green-500" title="Actif" />
                        ) : (
                          <IoCloseCircle className="mx-auto text-lg text-red-500" title="Inactif" />
                        )}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        <div className="dropdown dropdown-left">
                          <button tabIndex={0} className="btn btn-sm border border-slate-300 bg-[#164b90] text-white px-3">
                            Options
                          </button>
                          <ul
                            tabIndex={0}
                            className="dropdown-content z-[1] mt-1 w-56 rounded-md border border-slate-200 bg-white p-2 shadow-md"
                          >
                            <li>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-slate-50"
                                onClick={() =>
                                  setUsers((prev) =>
                                    prev.map((u) => (u.id === user.id ? { ...u, actif: !u.actif } : u))
                                  )
                                }
                              >
                                {user.actif ? <FaLock /> : <FaUnlockAlt />}
                                <span>{user.actif ? "Désactiver" : "Activer"}</span>
                              </button>
                            </li>
                            <li>
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm hover:bg-slate-50"
                              >
                                <MdPassword />
                                <span>Réinitialiser password</span>
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!filteredUsers.length ? (
                    <tr>
                      <td className="px-3 py-4 text-center text-slate-500" colSpan={8}>
                        Aucun utilisateur ne correspond à votre recherche.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-[#eef2f6] px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B] hover:bg-[#e6edf9]">
                  &lt;
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#1E4F9B] bg-[#1E4F9B] text-white shadow-sm">
                  1
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-[#1E4F9B] shadow-sm hover:border-[#1E4F9B] hover:bg-[#e6edf9]">
                  &gt;
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-slate-600">Afficher</span>
                <div className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1 text-slate-700 shadow-sm">
                  <span>10</span>
                  <IoChevronDown className="text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showModal ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-3xl rounded-lg bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-800">Ajouter un utilisateur</h3>
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
                  <select
                    value={form.actif ? "actif" : "inactif"}
                    onChange={(e) => setForm((f) => ({ ...f, actif: e.target.value === "actif" }))}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#1E4F9B] focus:ring-1 focus:ring-[#1E4F9B]"
                  >
                    <option value="actif">Actif</option>
                    <option value="inactif">Inactif</option>
                  </select>
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

export default UsersPage

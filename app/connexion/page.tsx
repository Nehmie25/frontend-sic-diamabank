"use client"
import Image from "next/image"
import { useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { useRouter } from "next/navigation"

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return
    setLoading(true)
    // Simulation simple : on redirige vers la page d'accueil
    setTimeout(() => {
      router.push("/")
    }, 700)
  }

  return (
    <div className="grid h-screen w-screen bg-white md:grid-cols-2">
      <div className="flex flex-col items-center justify-center gap-8 px-10 py-12 bg-slate-50">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-slate-800 tracking-wide">E-BILL - SIC</h1>
          <Image src="/cashback.png" alt="Logo" width={48} height={48} className="mx-auto h-12 w-12" priority />
          <p className="text-xl text-slate-700">CONNEXION</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-md">
          <div className="space-y-2">
            <input
              type="text"
              required
              placeholder="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-white px-4 py-3 pr-12 text-sm text-slate-700 shadow-sm outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              <button
                type="button"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#1E4F9B] py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
              loading ? "cursor-not-allowed opacity-80" : "hover:bg-[#1a4587]"
            }`}
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            Se connecter
          </button>
        </form>
      </div>

      <div className="relative block bg-slate-200">
        <Image
          src="/login-hero.jpg"
          alt="connexion image"
          fill
          className="object-contain"
        />
      </div>
    </div>
  )
}

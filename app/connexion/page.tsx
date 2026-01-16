"use client"
import Image from "next/image"
import { useState } from "react"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"
import { useRouter } from "next/navigation"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

export default function ConnexionPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) 
    {
      toast.info("veuillez remplir tous les champs", { autoClose: 1000 })
      return
    }
    setLoading(true)
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Response status:", response);
      if (!response.ok && response.status === 401) {
        toast.error("Identifiants incorrects. Veuillez réessayer.")
        return
      }

      if (!response.ok && response.status === 500) {
        toast.error("Erreur interne, veuillez contacter l'administrateur.")
        return
      }
      

      
      const data = await response.json()
      console.log("Données reçues:", data)
      if (data.token) {
        // Stockage du token dans le localStorage
        localStorage.setItem("token", data.token)
      }
      // Redirection vers le dashboard
        router.push("/dashboard")
        
    } catch (error) {
      console.error("Erreur de connexion:", error)
      //alert("Erreur de connexion. Veuillez réessayer.")
      toast.error("Échec de la connexion. Vérifiez vos identifiants.")
    } finally {
      setLoading(false)
    }
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
          <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeButton theme="light" />

          <div className="space-y-2">
            <input
              type="text"
              required
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

      <div className="relative w-full h-screen">
        <Image
          src="/image_login.jpg"
          alt="Image full page"
          fill
          className="object-cover"
          priority
        />
      </div>

    </div>
  )
}

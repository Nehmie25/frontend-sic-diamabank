'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { isTokenExpired, clearTokenData, getTimeUntilExpiration } from '@/lib/tokenUtils'

export default function TokenExpirationHandler() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Ne pas vérifier le token sur la page de connexion
    if (pathname === '/connexion') {
      return
    }

    // Vérifier le token au montage du composant
    if (isTokenExpired()) {
      clearTokenData()
      router.replace('/connexion')
      return
    }

    // Configurer une vérification périodique toutes les minutes
    const checkTokenInterval = setInterval(() => {
      if (isTokenExpired()) {
        clearTokenData()
        router.replace('/connexion')
        clearInterval(checkTokenInterval)
      }
    }, 60000) // Vérifier toutes les 60 secondes

    // Calculer le temps jusqu'à l'expiration et configurer une vérification au moment exact
    const timeUntilExpiration = getTimeUntilExpiration()
    if (timeUntilExpiration > 0) {
      const expirationTimer = setTimeout(() => {
        clearTokenData()
        router.replace('/connexion')
        clearInterval(checkTokenInterval)
      }, timeUntilExpiration)

      return () => {
        clearInterval(checkTokenInterval)
        clearTimeout(expirationTimer)
      }
    }

    return () => {
      clearInterval(checkTokenInterval)
    }
  }, [router, pathname])

  return null
}
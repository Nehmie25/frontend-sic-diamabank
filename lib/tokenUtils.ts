export interface TokenPayload {
  email?: string
  nom?: string
  role?: string
  id?: number | string
  exp?: number
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    // Un JWT a 3 parties séparées par des points: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.error('Token invalide: format incorrect')
      return null
    }

    // Décoder le payload (deuxième partie)
    const payload = parts[1]
    // Décoder en UTF-8 pour gérer correctement les accents
    const decoded = JSON.parse(
      decodeURIComponent(atob(payload).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    )
    return decoded as TokenPayload
  } catch (error) {
    console.error('Erreur lors du décodage du token:', error)
    return null
  }
}

export function storeTokenData(token: string): boolean {
  const tokenData = decodeToken(token)
  if (!tokenData) {
    return false
  }

  // Stocker le token
  localStorage.setItem('token', token)

  // Stocker les informations du token
  localStorage.setItem('tokenData', JSON.stringify(tokenData))
  
  // Stocker les infos importantes séparément pour un accès facile
  if (tokenData.email) localStorage.setItem('userEmail', tokenData.email)
  if (tokenData.nom) localStorage.setItem('userName', tokenData.nom)
  if (tokenData.role) localStorage.setItem('userRole', tokenData.role)
  if (tokenData.id) localStorage.setItem('userId', String(tokenData.id))

  return true
}

export function getTokenData(): TokenPayload | null {
  try {
    const tokenData = localStorage.getItem('tokenData')
    if (!tokenData) return null
    return JSON.parse(tokenData) as TokenPayload
  } catch (error) {
    console.error('Erreur lors de la récupération des données du token:', error)
    return null
  }
}

export function getUserInfo() {
  return {
    email: localStorage.getItem('userEmail'),
    name: localStorage.getItem('userName'),
    role: localStorage.getItem('userRole'),
    id: localStorage.getItem('userId'),
  }
}

export function clearTokenData() {
  localStorage.removeItem('token')
  localStorage.removeItem('tokenData')
  localStorage.removeItem('userEmail')
  localStorage.removeItem('userName')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userId')
}

export function isTokenExpired(): boolean {
  try {
    const tokenData = getTokenData()
    if (!tokenData || !tokenData.exp) {
      return true
    }
    
    // exp est en secondes, Date.now() est en millisecondes
    const expirationTime = tokenData.exp * 1000
    const currentTime = Date.now()
    
    // Le token est expiré si l'heure actuelle dépasse l'heure d'expiration
    return currentTime > expirationTime
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error)
    return true
  }
}

export function getTimeUntilExpiration(): number {
  try {
    const tokenData = getTokenData()
    if (!tokenData || !tokenData.exp) {
      return 0
    }
    
    const expirationTime = tokenData.exp * 1000
    const currentTime = Date.now()
    const timeLeft = expirationTime - currentTime
    
    // Retourner le temps restant en millisecondes (minimum 0)
    return Math.max(0, timeLeft)
  } catch (error) {
    console.error('Erreur lors du calcul du temps restant:', error)
    return 0
  }
}
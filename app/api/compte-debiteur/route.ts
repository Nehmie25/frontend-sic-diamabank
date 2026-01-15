export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')
    const authHeader = request.headers.get('authorization')

    if (!date) {
      return Response.json({ error: "Paramètre 'date' manquant" }, { status: 400 })
    }
    if (!authHeader) {
      return Response.json({ error: "Token d'authentification manquant" }, { status: 401 })
    }

    const response = await fetch(
      `http://10.0.20.32:8181/declaration/comptedebiteurs?date=${encodeURIComponent(date)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`)
    }

    const data = await response.text()
    return new Response(data, {
      status: response.status,
      headers: { 'Content-Type': 'application/xml; charset=utf-8' },
    })
  } catch (error) {
    console.error('Erreur API compte-debiteur:', error)
    return Response.json({ error: 'Erreur serveur lors de la récupération des données' }, { status: 500 })
  }
}

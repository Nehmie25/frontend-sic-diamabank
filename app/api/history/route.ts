export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return Response.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'

    const response = await fetch(
      `http://10.0.20.32:8181/users/historique?page=${page}`,
      {
        method: "GET",
        headers: {
          "Authorization": authHeader,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()


    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
  } catch (error) {
    console.error("Erreur :", error)
    return Response.json(
      { error: "Erreur serveur lors de la récupération des données" + error },
      { status: 500 }
    )
  }
}
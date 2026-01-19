export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return Response.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      )
    }

    const response = await fetch(
      `http://10.0.20.32:8181/users`,
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
    console.error("Erreur API get-users:", error)
    return Response.json(
      { error: "Erreur serveur lors de la récupération des données" + error },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return Response.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      )
    }

    const body = await request.json()

    const response = await fetch(
      `http://10.0.20.32:8181/users/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(body),
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
    console.error("Erreur API post-users:", error)
    return Response.json(
      { error: "Erreur serveur lors de l'envoi des données" + error },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
      return Response.json(
        { error: "Token d'authentification manquant" },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log(body);

    const response = await fetch(
      `http://10.0.20.32:8181/users/updatestate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(body),
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
    console.error("Erreur API put-users:", error)
    return Response.json(
      { error: "Erreur serveur lors de la mise à jour des données" + error },
      { status: 500 }
    )
  }
}

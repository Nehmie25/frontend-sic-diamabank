export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const response = await fetch("http://10.0.20.32:8181/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
    return Response.json(data, { status: response.status })
  } catch (error) {
    console.error("Erreur API login:", error)
    return Response.json(
      { error: "Erreur serveur" },
      { status: 500 }
    )
  }
}

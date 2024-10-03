export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  // This secret key just allows us to make sure no one externally can hit this endpoint
  if (secret !== process.env.API_SECRET) {
    return Response.json({ message: "Invalid secret token.", status: 401 });
  }
  // API endpoint for all deployments for GotRhythm Vercel team
  const apiUrl = `https://api.vercel.com/v5/now/deployments/?teamId=${process.env.VERCEL_TEAM_ID}`;

  try {
    const fetchDeployments = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",

        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
      },
    });

    if (fetchDeployments.ok) {
      const deploymentsJson = await fetchDeployments.json();

      if (deploymentsJson) {
        return Response.json(deploymentsJson.deployments);
      }
    }

    return Response.json({ error: "Failed to fetch deployments." });
  } catch (error) {
    return Response.json({ error });
  }
}

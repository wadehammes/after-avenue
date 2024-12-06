//TODO: only type what is needed from the response (currently just basic temp info for testing)
export interface Deployment {
    name: string;
    readyState: string;
    type: string;
    source: string;
    created: number; // UNIX timestamp
}


//TODO: (MAYBE) convert this to use the fetchResponse function from api/helpers.ts
export async function fetchAllDeployments(): Promise<Deployment[]> {
    //TODO: change the function to either actually return all the deployments or just return the latest
    const limit = 3; // number of deployments to fetch per request (can change this system in future if need to actually pull all deployments)
    // let allDeployments: Deployment[] = [];
  
    try {
        // Build the URL with limit and until (if fetching subsequent pages)
        //TODO: switch the id in the local file to the After Avenue id (currently is the provisoner id)
        const vercel = `https://api.vercel.com/v1/deployments?teamId=${process.env.VERCEL_TEAM_ID}&projectId=${process.env.VERCEL_PROJECT_ID}&limit=${limit}`;
  
        // Fetch the deployments from Vercel API
        const response = await fetch(vercel, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
           throw new Error(`Error fetching deployments: ${response.statusText}`);
        }
  
        // Parse the JSON response
        const data = await response.json(); 
        const deployments = data.deployments as Deployment[];

        console.log(deployments);
    return deployments;
    } catch (error) {
        console.error('Error fetching deployments:', error);
        throw error;
    }
}
  
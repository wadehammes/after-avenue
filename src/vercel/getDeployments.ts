//TODO: only type what is needed from the response
export interface Deployment {
	uid: string;
	name: string;
	created: number; // UNIX timestamp
	source: string;
	state: string;
	readyState: string;
	readySubstate?: string;
	type: string;
	creator: {
		uid: string;
		githubLogin?: string;
	};
	meta: {
		githubCommitAuthorName: string;
		githubCommitOrg: string;
		githubCommitRef: string;
		githubOrg: string;
		githubRepo: string;
	};
	 createdAt: number; // UNIX timestamp
	buildingAt: number; // UNIX timestamp
	ready: number; // UNIX timestamp
}

const endpoint = `https://api.vercel.com/v6/deployments?projectId=${process.env.VERCEL_PROJECT_ID}&teamId=${process.env.VERCEL_TEAM_ID}&name=after-avenue`;

//TODO: (MAYBE) convert this to use the fetchResponse function from api/helpers.ts
export async function fetchAllDeployments(): Promise<Deployment[]> {
	try {
		// Build the URL
		const vercel = `${endpoint}`;

		// Fetch the deployments from Vercel API
		const response = await fetch(vercel, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error fetching deployments: ${response.statusText}`);
		}

		// Parse the JSON response
		const data = await response.json();
		const deployments = data.deployments as Deployment[];

		console.log(
			deployments.filter((deployment) => deployment.name === "after-avenue"),
		);
		return deployments;
	} catch (error) {
		console.error("Error fetching deployments:", error);
		throw error;
	}
}

export async function fetchLatestDeployment(): Promise<Deployment[]> {
	const limit = 1; // number of deployments to fetch per request (can change this system in future if need to actually pull all deployments)

	try {
		// Build the URL with limit
		const vercel = `${endpoint}&limit=${limit}`;

		// Fetch the deployments from Vercel API
		const response = await fetch(vercel, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`Error fetching deployments: ${response.statusText}`);
		}

		// Parse the JSON response
		const data = await response.json();
		const deployments = data.deployments as Deployment[];

		console.log(
			deployments.filter((deployment) => deployment.name === "after-avenue"),
		);
		return deployments;
	} catch (error) {
		console.error("Error fetching deployments:", error);
		throw error;
	}
}

export async function fetchFilteredDeployments(
	limit?: number,
	state?: string,
): Promise<Deployment[]> {
	try {
		// Build the URL
		const vercel = `${endpoint}&limit=${limit ? limit : ""}&state=${state ? state : ""}`;

		// Fetch the deployments from Vercel API
		const response = await fetch(vercel, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
				"Content-Type": "application/json",
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
		console.error("Error fetching deployments:", error);
		throw error;
	}
}

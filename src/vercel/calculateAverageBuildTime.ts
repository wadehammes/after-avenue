import type { Deployment } from "./getDeployments";

export function calculateAverageBuildTime(deployments: Deployment[]): string {
  if (deployments.length === 0) {
    return "No deployments available to calculate build time.";
  }

  const totalBuildTime = deployments.reduce((total, current) => {
    return total + (current.ready - current.createdAt);
  }, 0);

  const averageBuildTimeInMs = totalBuildTime / deployments.length;
  const averageBuildTimeInSeconds = Math.round(averageBuildTimeInMs / 1000);

  return `${averageBuildTimeInSeconds}`;
}

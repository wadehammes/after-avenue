"use client";

import { useEffect, useState } from "react";
import { DeploymentCard } from "src/components/DeploymentCard/DeploymentCard.component";
import styles from "src/components/VercelPage/VercelPage.module.css";
import { calculateAverageBuildTime } from "src/vercel/calculateAverageBuildTime";
import {
  type Deployment,
  fetchFilteredDeployments,
} from "src/vercel/getDeployments";

interface VercelPageProps {
  initialDeployments: Deployment[];
  latestBuilding: Deployment[];
}

export const VercelPage = (props: VercelPageProps) => {
  const { initialDeployments, latestBuilding } = props;
  const [refreshTime, setRefreshTime] = useState<number>(Date.now());
  const [refreshCount, setRefreshCount] = useState<number>(30);

  // Refresh deployments every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount((prev) => prev - 1);
    }, 1000);

    if (refreshCount === 0) {
      setRefreshCount(30);
      setRefreshTime(Date.now());
    }

    return () => clearInterval(interval);
  }, [refreshCount]);

  //TODO: finish styling the page and its components to look how intended with a clean styling
  //TODO: fix the description under the h1 to be same width as the rest of the page
  //TODO: fix the refreshing of the deployments

  return (
    <div key={refreshTime} className={styles.vercelPage}>
      <h1>Vercel Deployments</h1>
      <p>
        This is the most recent deployments of the website. If there is a
        currently buidling deployment then it will show above the latest ready
        one.
      </p>
      <p>
        Average build time:{" "}
        {calculateAverageBuildTime(
          initialDeployments.filter(
            (deployment) => deployment.readyState === "READY",
          ),
        )}
      </p>
      <p>
        <strong>Next refresh: {refreshCount}</strong>
      </p>
      <div className={styles.cards}>
        {latestBuilding.map((deployment: Deployment) => (
          <DeploymentCard key={deployment.uid} deployment={deployment} />
        ))}
        {initialDeployments.map((deployment: Deployment) => (
          <DeploymentCard key={deployment.uid} deployment={deployment} />
        ))}
      </div>
    </div>
  );
};

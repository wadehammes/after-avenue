import classNames from "classnames";
import type { HTMLAttributes } from "react";
import styles from "src/components/DeploymentCard/DeploymentCard.module.css";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";
import GitHubBrandmark from "src/icons/GitHubBrandmark.svg";
import VercelDate from "src/icons/VercelDate.icon.svg";
import VercelLink from "src/icons/VercelLink.icon.svg";
import VercelRedo from "src/icons/VercelRedo.icon.svg";
import VercelUser from "src/icons/VercelUser.icon.svg";
import { formatTimestampToDate } from "src/utils/helpers";
import type { Deployment } from "src/vercel/getDeployments";

interface DeploymentCardProps extends HTMLAttributes<HTMLDivElement> {
  deployment: Deployment;
}

// TODO: finalize the styling of the card
export const DeploymentCard = (props: DeploymentCardProps) => {
  const { deployment } = props;
  const repoUrl = `https://github.com/${deployment.meta.githubOrg}/${deployment.meta.githubRepo}/tree/${deployment.meta.githubCommitRef}`;

  //function to return appropriate icon for the deployment source
  const sourceIcon = () => {
    switch (deployment.source) {
      case "git":
        return <GitHubBrandmark className={styles.icons} />;
      case "redeploy":
        return <VercelRedo className={styles.icons} />;
      default:
        return <div className={styles.icons} />;
    }
  };

  // TODO: fix the color of the building state. For some reason it is changing the entire card
  const deploymentColor = () => {
    switch (deployment.readyState) {
      case "ERROR":
        return styles.error;
      case "BUILDING":
        return styles.building;
      default:
        return "";
    }
  };

  //TODO: fix the sizing of the icons

  return (
    <div className={classNames(styles.deploymentCard, deploymentColor())}>
      <div className={styles.header}>
        <AfterAvenueBrandmark className={styles.headerLogo} />
        <span className={styles.headerTitle}>{deployment.readyState}</span>
      </div>
      <div className={styles.contentSection}>
        <div className={styles.content}>
          {sourceIcon()}
          <p className={styles.sourceName}>{deployment.source}</p>
        </div>
        <div className={styles.content}>
          <VercelDate className={styles.icons} />
          <p className={styles.date}>
            {formatTimestampToDate(deployment.created)}
          </p>
        </div>
        <div className={styles.content}>
          <VercelUser className={styles.icons} />
          <p className={styles.author}>
            by {deployment.meta.githubCommitAuthorName}
          </p>
        </div>
        <div className={styles.content}>
          <VercelLink className={styles.icons} />
          <a className={styles.links} href={repoUrl}>
            View Github commit
          </a>
        </div>
      </div>
    </div>
  );
};

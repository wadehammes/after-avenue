import styles from "src/components/VercelPage/VercelPage.module.css";
import type { Deployment } from "src/vercel/getDeployments";
import { formatTimestampToDate } from "src/utils/helpers";


interface VercelPageProps {
  initialDeployments: Deployment[];
}

export const VercelPage = (props: VercelPageProps) => {
  const { initialDeployments } = props;

  //TODO: finish adding interval polling to fetch new deployments
  
  //TODO: add a variable that holds the countdown to next refresh and add it into the page
  //TODO: actually format and style the page to look how intended with a clean styling
  return (
    <div className={styles.statusTable}>
        <table className={styles.statusTable}>
            <thead>
            <tr>
                <th className={styles.statusTable}>Name</th>
                <th className={styles.statusTable}>Ready State</th>
                <th className={styles.statusTable}>Type</th>
                <th className={styles.statusTable}>Source</th>
                <th className={styles.statusTable}>Date</th>
            </tr>
            </thead>
            <tbody>
            {initialDeployments.map((deployment, index) => (
                //TODO: change the key to something else (prob just uid from response)
                <tr key={index}>
                    <td className={styles.statusTable}>{deployment.name}</td>
                    <td className={styles.statusTable}>{deployment.readyState}</td>
                    <td className={styles.statusTable}>{deployment.type}</td>
                    <td className={styles.statusTable}>{deployment.source}</td>
                    <td className={styles.statusTable}>{formatTimestampToDate(deployment.created)}</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
  );
};

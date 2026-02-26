import { DeployButton } from "src/components/DeployButton/DeployButton.component";
import styles from "src/components/DeployPage/DeployPage.module.css";

export const DeployPage = () => {
  return (
    <div className={styles.deployPage}>
      <header className={styles.deployPageHeader}>
        <h1 className={styles.deployPageTitle}>Refresh Site Content</h1>
        <p>
          Publish your latest content from the CMS to the live site. This only
          updates content—no code changes, so you can use without fear!
        </p>
      </header>
      <div className={styles.buttonGroup}>
        <DeployButton
          deployHook="https://api.vercel.com/v1/integrations/deploy/prj_7r3yf8SloXLJ13QSCqzwKY9FM22B/HhAxrrHeyC"
          label="Refresh staging.afteravenue.com"
        />

        <DeployButton
          deployHook="https://api.vercel.com/v1/integrations/deploy/prj_7r3yf8SloXLJ13QSCqzwKY9FM22B/eMWRP11bN6"
          label="Refresh afteravenue.com"
        />
      </div>
    </div>
  );
};

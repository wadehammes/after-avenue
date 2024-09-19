import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import PlayIconSVG from "src/icons/PlaySolid.icon.svg";

export const PlayIcon = () => {
  return (
    <>
      <div className={styles.playIconOverlay} />
      <div className={styles.playIcon}>
        <PlayIconSVG />
      </div>
    </>
  );
};

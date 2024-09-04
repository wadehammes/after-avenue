import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import PlayIconSVG from "src/icons/Play.icon.svg";

export const PlayIcon = () => {
  return (
    <div className={styles.playIcon}>
      <PlayIconSVG />
    </div>
  );
};

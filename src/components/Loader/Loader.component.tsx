import styles from "src/components/Loader/Loader.module.css";
import AfterAvenueBrandmark from "src/icons/AfterAvenueBrandmark.svg";

export const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <AfterAvenueBrandmark className={styles.loader} />
    </div>
  );
};

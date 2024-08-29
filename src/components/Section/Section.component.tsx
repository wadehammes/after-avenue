import { HTMLAttributes } from "react";
import styles from "src/components/Section/Section.module.css";

export const Section = (props: HTMLAttributes<HTMLDivElement>) => {
  const { children } = props;

  return <section className={styles.section}>{children}</section>;
};

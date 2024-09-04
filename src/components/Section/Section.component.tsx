import classNames from "classnames";
import { HTMLAttributes } from "react";
import styles from "src/components/Section/Section.module.css";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Section = (props: SectionProps) => {
  const { children, noPadding } = props;

  return (
    <section
      className={classNames(styles.section, { [styles.noPadding]: noPadding })}
    >
      {children}
    </section>
  );
};

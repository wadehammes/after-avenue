import classNames from "classnames";
import { HTMLAttributes } from "react";
import styles from "src/components/Section/Section.module.css";
import { SectionType } from "src/contentful/parseSections";
import { RichText } from "src/contentful/richText";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  noPadding?: boolean;
  section?: SectionType | null;
  sectionHeaderAlignment?: "left" | "center" | "right";
  style?: React.CSSProperties;
}

export const Section = (props: SectionProps) => {
  const {
    className,
    section,
    sectionHeaderAlignment,
    children,
    noPadding,
    style,
  } = props;
  return (
    <section
      className={classNames(className, styles.section, {
        [styles.noPadding]: noPadding,
      })}
      style={style}
    >
      {section?.sectionHeader ? (
        <header
          className={classNames("section-header", {
            left: sectionHeaderAlignment === "left",
            right: sectionHeaderAlignment === "right",
          })}
        >
          <RichText document={section.sectionHeader} />
        </header>
      ) : null}
      <div className={classNames(styles.sectionContent)}>{children}</div>
    </section>
  );
};

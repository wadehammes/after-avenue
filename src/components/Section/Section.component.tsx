import classNames from "classnames";
import { HTMLAttributes } from "react";
import styles from "src/components/Section/Section.module.css";
import { SectionType } from "src/contentful/parseSections";
import { RichText } from "src/contentful/richText";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  section?: SectionType | null;
  sectionHeaderAlignment?: "left" | "center" | "right";
  noPadding?: boolean;
}

export const Section = (props: SectionProps) => {
  const { section, sectionHeaderAlignment, children, noPadding } = props;

  return (
    <section
      className={classNames(styles.section, { [styles.noPadding]: noPadding })}
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
      {children}
    </section>
  );
};

"use client";

import classNames from "classnames";
import { HTMLAttributes } from "react";
import { useInView } from "react-intersection-observer";
import styles from "src/components/Section/Section.module.css";
import { SectionType } from "src/contentful/parseSections";
import { RichText } from "src/contentful/richText";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  section?: SectionType | null;
  sectionHeaderAlignment?: "left" | "center" | "right";
  noPadding?: boolean;
  style?: React.CSSProperties;
}

export const Section = (props: SectionProps) => {
  const { section, sectionHeaderAlignment, children, noPadding, style } = props;
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.75,
  });

  return (
    <section
      ref={ref}
      className={classNames(styles.section, { [styles.noPadding]: noPadding })}
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
      <div
        className={classNames(styles.sectionContent, {
          [styles.inView]: inView,
        })}
      >
        {children}
      </div>
    </section>
  );
};

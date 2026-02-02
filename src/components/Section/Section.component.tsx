import classNames from "classnames";
import type { HTMLAttributes } from "react";
import styles from "src/components/Section/Section.module.css";
import type {
  SectionBackgroundColorType,
  SectionType,
} from "src/contentful/parseSections";
import { RichText } from "src/contentful/richText";
import { Alignment } from "src/interfaces/common.interfaces";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  noPadding?: boolean;
  section?: SectionType | null;
  sectionHeaderAlignment?: Alignment;
  sectionBackgroundColor?: SectionBackgroundColorType;
  style?: React.CSSProperties;
}

export const Section = ({
  className,
  section,
  sectionHeaderAlignment,
  children,
  noPadding,
  style,
  sectionBackgroundColor,
}: SectionProps) => {
  const noSectionPadding = noPadding || section?.sectionPadding === "None";

  return (
    <section
      id={section?.slug}
      className={classNames(className, styles.section, {
        [styles.noPadding]: noSectionPadding,
        [styles.sectionBackgroundColorBlack]:
          sectionBackgroundColor === "Black",
        [styles.sectionBackgroundColorWhite]:
          sectionBackgroundColor === "White",
        [styles.sectionBackgroundColorYellow]:
          sectionBackgroundColor === "Yellow",
      })}
      style={style}
    >
      {section?.sectionHeader && (
        <header
          className={classNames("section-header", {
            left: sectionHeaderAlignment === Alignment.Left,
            right: sectionHeaderAlignment === Alignment.Right,
            center: sectionHeaderAlignment === Alignment.Center,
          })}
        >
          <RichText document={section.sectionHeader} />
        </header>
      )}
      <div
        className={classNames(styles.sectionContent, {
          [styles.container]:
            section?.contentLayout !== "Full Width" &&
            section?.contentLayout !== undefined,
          [styles.singleColumn]: section?.contentLayout === "Single Column",
          [styles.twoColumn]: section?.contentLayout === "Two Column",
          [styles.threeColumn]: section?.contentLayout === "Three Column",
          [styles.fourColumn]: section?.contentLayout === "Four Column",
        })}
      >
        {children}
      </div>
    </section>
  );
};

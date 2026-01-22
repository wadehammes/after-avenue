import classNames from "classnames";
import type { HTMLAttributes } from "react";
import styles from "src/components/Section/Section.module.css";
import type { SectionType } from "src/contentful/parseSections";
import {
  ContentLayout,
  SectionBackgroundColor,
  SectionPadding,
} from "src/contentful/parseSections";
import { RichText } from "src/contentful/richText";
import { Alignment } from "src/interfaces/common.interfaces";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  noPadding?: boolean;
  section?: SectionType | null;
  sectionHeaderAlignment?: Alignment;
  sectionBackgroundColor?: SectionBackgroundColor;
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
  const noSectionPadding =
    noPadding || section?.sectionPadding === SectionPadding.None;

  return (
    <section
      id={section?.slug}
      className={classNames(className, styles.section, {
        [styles.noPadding]: noSectionPadding,
        [styles.sectionBackgroundColorBlack]:
          sectionBackgroundColor === SectionBackgroundColor.Black,
        [styles.sectionBackgroundColorWhite]:
          sectionBackgroundColor === SectionBackgroundColor.White,
        [styles.sectionBackgroundColorYellow]:
          sectionBackgroundColor === SectionBackgroundColor.Yellow,
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
            section?.contentLayout !== ContentLayout.FullWidth &&
            section?.contentLayout !== undefined,
          [styles.singleColumn]:
            section?.contentLayout === ContentLayout.SingleColumn,
          [styles.twoColumn]:
            section?.contentLayout === ContentLayout.TwoColumn,
          [styles.threeColumn]:
            section?.contentLayout === ContentLayout.ThreeColumn,
          [styles.fourColumn]:
            section?.contentLayout === ContentLayout.FourColumn,
        })}
      >
        {children}
      </div>
    </section>
  );
};

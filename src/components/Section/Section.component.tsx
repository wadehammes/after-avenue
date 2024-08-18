import classNames from "classnames";
import { HTMLAttributes, Ref } from "react";
import styles from "src/components/Section/Section.module.css";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  color?: "white" | "green" | "gray";
  fullBleed?: boolean;
  noTopPadding?: boolean;
  overlapBottom?: boolean;
  topOverlapPadding?: boolean;
  padded?: boolean;
  ref?: Ref<HTMLDivElement>;
}

export const Section = (props: SectionProps) => {
  const {
    children,
    color = "green",
    fullBleed,
    padded,
    noTopPadding,
    overlapBottom,
    topOverlapPadding,
    ...restProps
  } = props;

  return (
    <div
      {...restProps}
      className={classNames(styles.section, {
        [styles.fullBleed]: fullBleed,
        [styles.padded]: padded,
        [styles.noTopPadding]: noTopPadding,
        [styles.whiteBg]: color === "white",
        [styles.grayBg]: color === "gray",
        [styles.topOverlapPadding]: topOverlapPadding,
        [styles.overlapBottom]: overlapBottom,
      })}
    >
      {children}
    </div>
  );
};

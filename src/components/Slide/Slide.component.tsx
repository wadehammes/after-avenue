"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import { useInView } from "react-intersection-observer";
import { Media } from "src/components/Media/Media.component";
import styles from "src/components/Slide/Slide.module.css";
import { ComponentSlide } from "src/contentful/parseComponentSlide";

interface SlideProps {
  fields: ComponentSlide | null;
  index: number;
}

export const Slide = (props: SlideProps) => {
  const { fields, index } = props;
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  if (!fields) {
    return null;
  }

  const {
    backgroundMedia,
    headline,
    backgroundColor,
    backgroundOpacity,
    subheadline,
  } = fields;

  return (
    <div
      className={styles.slide}
      style={{
        backgroundColor:
          backgroundColor === "Yellow"
            ? "var(--colors-street-lamp-yellow)"
            : "var(--colors-black)",
        color:
          backgroundColor === "Yellow"
            ? "var(--colors-black)"
            : "var(--colors-white)",
      }}
      ref={ref}
    >
      <div className={styles.slideContent}>
        <div
          className={classNames(styles.slideBackgroundMediaContainer, {
            [styles.inView]: inView,
          })}
        >
          {backgroundMedia ? (
            <>
              <Media media={backgroundMedia} opacity={backgroundOpacity} />
              <div className={styles.mediaOverlay} />
            </>
          ) : null}
        </div>
        <header className={styles.slideHeader}>
          {index === 0 ? (
            <h1>{parse(headline as string)}</h1>
          ) : (
            <h2>{parse(headline as string)}</h2>
          )}
          {subheadline ? <p>{parse(subheadline as string)}</p> : null}
        </header>
      </div>
    </div>
  );
};

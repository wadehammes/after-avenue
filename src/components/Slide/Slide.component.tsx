"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { Media } from "src/components/Media/Media.component";
import styles from "src/components/Slide/Slide.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import type { ComponentSlide } from "src/contentful/parseComponentSlide";

interface SlideProps {
  fields?: ComponentSlide | null;
  index: number;
  children?: ReactNode;
}

export const Slide = (props: SlideProps) => {
  const { fields, index, children } = props;
  const { ref, inView } = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  return (
    <div className={styles.slide} ref={ref}>
      <div
        className={classNames(styles.slideBackgroundMediaContainer, {
          [styles.inView]: inView,
        })}
        style={{ opacity: !inView ? 0 : 1 }}
      >
        {fields?.backgroundMedia ? (
          <>
            <Media media={fields.backgroundMedia} />
            <div className={styles.mediaOverlay} />
          </>
        ) : null}
      </div>
      <div className={styles.slideContent}>
        {fields?.headline ? (
          <header
            className={classNames(styles.slideHeader, {
              [styles.animated]: inView,
            })}
          >
            {index === 0 ? (
              <h1>{parse(fields.headline as string)}</h1>
            ) : (
              <h2>{parse(fields.headline as string)}</h2>
            )}
            {fields?.subheadline ? (
              <p>{parse(fields.subheadline as string)}</p>
            ) : null}
            {fields?.pageHash ? (
              <div className="button-container">
                <StyledButtonLink
                  href={fields?.pageHash}
                  variant="outlined"
                  color="dark"
                >
                  {fields.ctaText}
                </StyledButtonLink>
              </div>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </div>
  );
};

"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import { ReactNode } from "react";
import { useInView } from "react-intersection-observer";
import { Media } from "src/components/Media/Media.component";
import styles from "src/components/Slide/Slide.module.css";
import { ComponentSlide } from "src/contentful/parseComponentSlide";

interface SlideProps {
  fields?: ComponentSlide | null;
  index: number;
  children?: ReactNode;
}

export const Slide = (props: SlideProps) => {
  const { fields, index, children } = props;
  const { ref, inView } = useInView({
    threshold: 0.25,
  });

  return (
    <div className={styles.slide} ref={ref}>
      <div className={styles.slideContent}>
        <div
          className={classNames(styles.slideBackgroundMediaContainer, {
            [styles.inView]: inView,
          })}
          style={{ opacity: !inView ? 0 : 1 }}
        >
          {fields?.backgroundMedia ? (
            <>
              <Media
                media={fields.backgroundMedia}
                opacity={fields.backgroundOpacity}
              />
              <div className={styles.mediaOverlay} />
            </>
          ) : null}
        </div>
        {fields?.headline ? (
          <header className={styles.slideHeader}>
            {index === 0 ? (
              <h1
                className={classNames({
                  [styles.animated]: inView,
                })}
              >
                {parse(fields.headline as string)}
              </h1>
            ) : (
              <h2
                className={classNames({
                  [styles.animated]: inView,
                })}
              >
                {parse(fields.headline as string)}
              </h2>
            )}
            {fields?.subheadline ? (
              <p
                className={classNames({
                  [styles.animated]: inView,
                })}
              >
                {parse(fields.subheadline as string)}
              </p>
            ) : null}
          </header>
        ) : null}
        {children}
      </div>
    </div>
  );
};

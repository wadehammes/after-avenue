"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import styles from "src/components/HeroSlide/HeroSlide.module.css";
import { Media } from "src/components/Media/Media.component";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import type { ComponentSlide } from "src/contentful/parseComponentSlide";

interface HeroSlideProps {
  fields?: ComponentSlide | null;
  index: number;
  children?: ReactNode;
}

export const HeroSlide = (props: HeroSlideProps) => {
  const { fields, index, children } = props;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleHashClick = (e: MouseEvent<Element>) => {
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute("href");
    if (href?.startsWith("#")) {
      const id = href.slice(1);
      const element = document.getElementById(id);

      if (element) {
        e.preventDefault();
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 100;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  };

  if (!fields) {
    return null;
  }

  return (
    <div className={styles.heroSlide}>
      <div
        className={classNames(styles.slideBackgroundMediaContainer, {
          [styles.inView]: isVisible,
        })}
        style={{ opacity: isVisible ? 1 : 0 }}
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
              [styles.animated]: isVisible,
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
                  onClick={handleHashClick}
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

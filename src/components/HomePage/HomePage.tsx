"use client";

import classNames from "classnames";
import parse from "html-react-parser";
import { Activity, useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { FeaturedBrands } from "src/components/FeaturedBrands/FeaturedBrands.component";
import { FeaturedWork } from "src/components/FeaturedWork/FeaturedWork.component";
import styles from "src/components/HomePage/HomePage.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";

import type { Page } from "src/contentful/getPages";
import type { Work } from "src/contentful/getWork";

const SECONDARY_REEL_PREFETCH_DELAY_MS = 3_000;

interface HomePageProps {
  featuredWork: Work[];
  pageFields: Page;
}

export const HomePage = (props: HomePageProps) => {
  const { featuredWork, pageFields } = props;
  const {
    pageDisplayTitle,
    pageTitle,
    contactFooterTitle,
    contactFooterButtonText,
  } = pageFields;

  const { inView, ref } = useInView({
    rootMargin: "200px",
    threshold: 0,
  });

  const title = `After Avenue | ${pageTitle}`;
  const priorityVideoSlug = featuredWork.find(
    (work) => work.workVideoUrl,
  )?.workSlug;

  const hasFeaturedReels = featuredWork.some((work) => work.workVideoUrl);
  const [prefetchSecondaryReels, setPrefetchSecondaryReels] = useState(false);
  const secondaryPrefetchTimeoutRef = useRef<
    ReturnType<typeof setTimeout> | undefined
  >(undefined);

  const enableSecondaryReelPrefetch = useCallback(() => {
    clearTimeout(secondaryPrefetchTimeoutRef.current);
    setPrefetchSecondaryReels(true);
  }, []);

  useEffect(() => {
    if (!hasFeaturedReels) {
      return;
    }

    secondaryPrefetchTimeoutRef.current = setTimeout(() => {
      setPrefetchSecondaryReels(true);
    }, SECONDARY_REEL_PREFETCH_DELAY_MS);

    return () => {
      clearTimeout(secondaryPrefetchTimeoutRef.current);
    };
  }, [hasFeaturedReels]);

  return (
    <>
      <section className={styles.homeTitleSection}>
        <div className="container column">
          {pageDisplayTitle ? (
            <header className="section-header">
              <h1 className="hidden-title">{title}</h1>
              <h2 className={classNames(styles.homeMainTitle, styles.animated)}>
                {parse(pageDisplayTitle)}
              </h2>
            </header>
          ) : null}
        </div>
      </section>
      <section className={styles.featuredWorkContainer}>
        <div className="container column">
          {featuredWork.map((work) => {
            const isPriority = work.workSlug === priorityVideoSlug;
            const hasVideo = Boolean(work.workVideoUrl);
            const prefetchReel =
              hasVideo && (isPriority || prefetchSecondaryReels);

            return (
              <FeaturedWork
                fields={work}
                key={work.workSlug}
                onReelEmbedReady={
                  isPriority && hasVideo
                    ? enableSecondaryReelPrefetch
                    : undefined
                }
                prefetchReel={prefetchReel}
                priority={isPriority}
              />
            );
          })}
        </div>

        <div className="buttonContainer">
          <StyledButtonLink href="/work" variant="outlined" color="dark">
            Discover More
          </StyledButtonLink>
        </div>
      </section>
      <section ref={ref} className={styles.featuredBrandsSection}>
        <Activity mode={inView ? "visible" : "hidden"} name="FeaturedBrands">
          <FeaturedBrands />
        </Activity>
      </section>
      <section>
        <div className="container column">
          <div className="buttonContainer">
            <p>{contactFooterTitle}</p>
            <StyledButtonLink href="/contact" variant="outlined" color="dark">
              {contactFooterButtonText}
            </StyledButtonLink>
          </div>
        </div>
      </section>
    </>
  );
};

"use client";

import classNames from "classnames";
import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import type { Work } from "src/contentful/getWork";
import { useGlobalVariables } from "src/context/globalContext.context";
import PlayIcon from "src/icons/Play.icon.svg";
import scrollEntrance from "src/styles/scrollEntrance.module.css";
import { VIDEO_IN_VIEW_ROOT_MARGIN } from "src/utils/constants";
import { supportsScrollTimeline } from "src/utils/supportsScrollTimeline";
import { useMediaQuery } from "usehooks-ts";

const scrollTimelineSupported = supportsScrollTimeline();

function isElementInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top < viewportHeight && rect.bottom > 0;
}

function syncReelVisibility(
  node: HTMLElement,
  setMounted: (mounted: boolean) => void,
  setPlayInView: (play: boolean) => void,
  setHasAnimated: (animated: boolean) => void,
) {
  const visible = isElementInViewport(node);

  setPlayInView(visible);

  if (visible) {
    setMounted(true);

    if (!scrollTimelineSupported) {
      setHasAnimated(true);
    }
  }
}

interface FeaturedWorkProps {
  fields: Work;
  /** First homepage reel with video — plays on cold load when visible. */
  priority?: boolean;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const { fields, priority = false } = props;
  const { workVideoUrl, workSlug } = fields;
  const pathname = usePathname();

  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { featuredWorkButtonText } = useGlobalVariables();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [playInView, setPlayInView] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const { ref: inViewRef } = useInView({
    rootMargin: VIDEO_IN_VIEW_ROOT_MARGIN,
    threshold: 0,
    triggerOnce: false,
    onChange: (visible) => {
      setPlayInView(visible);

      if (visible) {
        setMounted(true);

        if (!scrollTimelineSupported) {
          setHasAnimated(true);
        }
      }
    },
  });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      inViewRef(node);
    },
    [inViewRef],
  );

  useLayoutEffect(() => {
    const node = rootRef.current;

    if (!node) {
      return;
    }

    const sync = () => {
      syncReelVisibility(node, setMounted, setPlayInView, setHasAnimated);
    };

    sync();
    requestAnimationFrame(sync);
  }, [pathname]);

  const showPlayer = workVideoUrl && (priority || mounted);

  return !isMobile ? (
    <div
      ref={setRef}
      className={classNames(styles.featuredWork, scrollEntrance.enter, {
        [scrollEntrance.animate]: hasAnimated,
        [scrollEntrance.readyToPlay]: priority,
      })}
    >
      <div className={styles.workOverlay}>
        <div className={styles.workOverlayText}>
          <h2>{fields.workClient}</h2>
          <p>{fields.workTitle}</p>
          <StyledButtonLink
            href={`/work/${workSlug}/?playVideo=true`}
            variant="outlined"
            color="dark"
          >
            <PlayIcon />
            {featuredWorkButtonText ?? "Watch Video"}
          </StyledButtonLink>
        </div>
      </div>
      {showPlayer ? (
        <div className={styles.videoContainer}>
          <VideoPlayer
            key={`${pathname}-${workSlug}`}
            autoPlay
            playInView={playInView}
            playInViewDelayMs={0}
            rounded
            src={workVideoUrl}
          />
        </div>
      ) : null}
    </div>
  ) : (
    <WorkCard
      work={fields}
      title={fields.workClient ?? ""}
      subtitle={fields.workTitle}
    />
  );
};

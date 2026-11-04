"use client";

import classNames from "classnames";
import { useCallback, useMemo, useRef } from "react";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import { useFeaturedReelInView } from "src/components/FeaturedWork/useFeaturedReelInView";
import { useFeaturedReelMedia } from "src/components/FeaturedWork/useFeaturedReelMedia";
import { LazyReactPlayer } from "src/components/LazyReactPlayer/LazyReactPlayer.component";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import type { Work } from "src/contentful/getWork";
import { useGlobalVariables } from "src/context/globalContext.context";
import PlayIcon from "src/icons/Play.icon.svg";
import scrollEntrance from "src/styles/scrollEntrance.module.css";
import {
  createMutedPlayerHandlers,
  findEmbedMediaElement,
  mutedAutoplayPlayerProps,
  reelPlayerConfig,
} from "src/utils/videoPlayerConfig";
import { useMediaQuery } from "usehooks-ts";

interface FeaturedWorkProps {
  fields: Work;
  prefetchReel?: boolean;
  priority?: boolean;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const { fields, prefetchReel = false, priority = false } = props;
  const { workVideoUrl, workSlug } = fields;

  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { featuredWorkButtonText } = useGlobalVariables();
  const { hasAnimated, hasMountedPlayer, inView, ref } = useFeaturedReelInView({
    prefetchPlayer: prefetchReel,
    priority,
  });
  const embedRef = useRef<HTMLDivElement>(null);

  const getMediaElement = useCallback(() => {
    const element = findEmbedMediaElement(embedRef.current);
    if (
      !element ||
      typeof element.play !== "function" ||
      typeof element.pause !== "function"
    ) {
      return null;
    }

    return {
      pause: () => element.pause?.() ?? Promise.resolve(),
      play: async () => {
        await element.play?.();
      },
    };
  }, []);

  const shouldPlay = priority || inView;
  const { onError, onMediaReady, remountKey } = useFeaturedReelMedia({
    active: hasMountedPlayer && shouldPlay,
    getMediaElement,
  });

  const muteHandlers = useMemo(
    () => createMutedPlayerHandlers(embedRef, onMediaReady),
    [onMediaReady],
  );

  return !isMobile ? (
    <div
      className={classNames(styles.featuredWork, scrollEntrance.enter, {
        [scrollEntrance.animate]: !priority && hasAnimated,
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
      {workVideoUrl ? (
        <div ref={ref} className={styles.videoContainer}>
          <div className={styles.videoPlayer}>
            <div ref={embedRef} className={styles.videoPlayerEmbed}>
              {hasMountedPlayer ? (
                <LazyReactPlayer
                  key={`${workVideoUrl}-${remountKey}`}
                  config={reelPlayerConfig}
                  controls={false}
                  loop
                  onError={onError}
                  playsInline
                  src={workVideoUrl}
                  width="100%"
                  height="100%"
                  {...mutedAutoplayPlayerProps}
                  {...muteHandlers}
                />
              ) : null}
            </div>
          </div>
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

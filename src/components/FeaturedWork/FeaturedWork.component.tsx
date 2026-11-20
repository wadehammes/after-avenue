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
import videoLoadingOverlay from "src/styles/videoLoadingOverlay.module.css";
import {
  createMutedPlayerHandlers,
  getEmbedMediaController,
  mutedAutoplayPlayerProps,
  reelPlayerConfig,
} from "src/utils/videoPlayerConfig";
import { useMediaQuery } from "usehooks-ts";

interface FeaturedWorkProps {
  fields: Work;
  onReelEmbedReady?: () => void;
  prefetchReel?: boolean;
  priority?: boolean;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const {
    fields,
    onReelEmbedReady,
    prefetchReel = false,
    priority = false,
  } = props;
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

  const getMediaElement = useCallback(
    () => getEmbedMediaController(embedRef.current),
    [],
  );

  const shouldPlay = priority || inView;

  const { hasStartedPlayback, onError } = useFeaturedReelMedia({
    active: hasMountedPlayer && shouldPlay,
    embedContainerRef: embedRef,
    embedEventsEnabled: hasMountedPlayer,
    getMediaElement,
    onEmbedCanPlay: onReelEmbedReady,
  });

  const muteHandlers = useMemo(() => createMutedPlayerHandlers(embedRef), []);

  return !isMobile ? (
    <div
      className={classNames(styles.featuredWork, {
        [scrollEntrance.enter]: !priority,
        [scrollEntrance.animate]: !priority && hasAnimated,
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
                  key={workVideoUrl}
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
            {hasMountedPlayer && shouldPlay ? (
              <div
                aria-hidden="true"
                className={classNames(videoLoadingOverlay.overlay, {
                  [videoLoadingOverlay.dotPattern]: true,
                  [videoLoadingOverlay.hidden]: hasStartedPlayback,
                  [videoLoadingOverlay.instantHide]: priority,
                })}
              />
            ) : null}
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

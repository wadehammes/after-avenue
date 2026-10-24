"use client";

import classNames from "classnames";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import { useFeaturedReelInView } from "src/components/FeaturedWork/useFeaturedReelInView";
import { useFeaturedWorkReelPlayer } from "src/components/FeaturedWork/useFeaturedWorkReelPlayer";
import { LazyReactPlayer } from "src/components/LazyReactPlayer/LazyReactPlayer.component";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import type { Work } from "src/contentful/getWork";
import { useGlobalVariables } from "src/context/globalContext.context";
import PlayIcon from "src/icons/Play.icon.svg";
import scrollEntrance from "src/styles/scrollEntrance.module.css";
import {
  mutedAutoplayPlayerProps,
  reelPlayerConfig,
} from "src/utils/videoPlayerConfig";
import { useMediaQuery } from "usehooks-ts";

interface FeaturedWorkProps {
  fields: Work;
  priority?: boolean;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const { fields, priority = false } = props;
  const { workVideoUrl, workSlug } = fields;

  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { featuredWorkButtonText } = useGlobalVariables();
  const { hasAnimated, ref, shouldPlay } = useFeaturedReelInView({
    priority,
  });
  const { embedRef, isVideoReady, muteHandlers, onError, playerKey } =
    useFeaturedWorkReelPlayer({
      shouldPlay,
      workVideoUrl,
    });

  return (
    <div data-testid="rhFeaturedWork">
      {!isMobile ? (
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
                <div
                  aria-busy={!isVideoReady}
                  aria-hidden={isVideoReady}
                  aria-label="Loading video"
                  className={classNames(styles.videoLoading, {
                    [styles.hidden]: isVideoReady,
                  })}
                  role="status"
                >
                  <div className="loading-spinner" />
                </div>
                <div ref={embedRef} className={styles.videoPlayerEmbed}>
                  <LazyReactPlayer
                    key={playerKey}
                    {...(priority ? { autoPlay: true } : {})}
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
      )}
    </div>
  );
};

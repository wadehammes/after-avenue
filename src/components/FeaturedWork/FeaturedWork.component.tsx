"use client";

import classNames from "classnames";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import type { Work } from "src/contentful/getWork";
import { useGlobalVariables } from "src/context/globalContext.context";
import { useVideoInView } from "src/hooks/useVideoInView";
import PlayIcon from "src/icons/Play.icon.svg";
import scrollEntrance from "src/styles/scrollEntrance.module.css";
import { useMediaQuery } from "usehooks-ts";

interface FeaturedWorkProps {
  fields: Work;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const { fields } = props;
  const { workVideoUrl } = fields;

  const isMobile = useMediaQuery("(max-width: 768px)", {
    initializeWithValue: false,
  });
  const { featuredWorkButtonText } = useGlobalVariables();
  const { hasAnimated, isNearView, setRef } = useVideoInView({
    triggerOnce: true,
  });

  return !isMobile ? (
    <div
      ref={setRef}
      className={classNames(styles.featuredWork, scrollEntrance.enter, {
        [scrollEntrance.animate]: hasAnimated,
      })}
    >
      <div className={styles.workOverlay}>
        <div className={styles.workOverlayText}>
          <h2>{fields.workClient}</h2>
          <p>{fields.workTitle}</p>
          <StyledButtonLink
            href={`/work/${fields.workSlug}/?playVideo=true`}
            variant="outlined"
            color="dark"
          >
            <PlayIcon />
            {featuredWorkButtonText ?? "Watch Video"}
          </StyledButtonLink>
        </div>
      </div>
      {workVideoUrl ? (
        <div className={styles.videoContainer}>
          <VideoPlayer
            autoPlay
            playInView={isNearView}
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

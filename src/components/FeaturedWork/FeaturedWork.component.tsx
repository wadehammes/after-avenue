"use client";

import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import { useFeaturedReelInView } from "src/components/FeaturedWork/useFeaturedReelInView";
import { StyledButtonLink } from "src/components/StyledButton/StyledButtonLink.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import type { Work } from "src/contentful/getWork";
import { useGlobalVariables } from "src/context/globalContext.context";
import PlayIcon from "src/icons/Play.icon.svg";
import scrollEntrance from "src/styles/scrollEntrance.module.css";
import {
  createMutedPlayerHandlers,
  ensureContainerMuted,
  mutedAutoplayPlayerProps,
  reelPlayerConfig,
} from "src/utils/videoPlayerConfig";
import { useMediaQuery } from "usehooks-ts";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

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
  const { hasAnimated, onPlayerReady, playInView, ref } = useFeaturedReelInView(
    {
      priority,
    },
  );
  const embedRef = useRef<HTMLDivElement>(null);
  const muteHandlers = useMemo(
    () => createMutedPlayerHandlers(embedRef, onPlayerReady),
    [onPlayerReady],
  );

  useEffect(() => {
    if (!playInView) {
      return;
    }

    ensureContainerMuted(embedRef.current);
  }, [playInView]);

  return !isMobile ? (
    <div
      ref={ref}
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
        <div className={styles.videoContainer}>
          <div className={styles.videoPlayer}>
            <div ref={embedRef} className={styles.videoPlayerEmbed}>
              <ReactPlayer
                autoPlay={priority}
                config={reelPlayerConfig}
                controls={false}
                loop
                playsInline
                playing={playInView}
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
  );
};

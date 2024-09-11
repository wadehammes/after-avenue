"use client";

import classNames from "classnames";
import { useInView } from "react-intersection-observer";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import type { Work } from "src/contentful/getWork";
import { useGlobalVariables } from "src/context/globalContext.context";
import PlayIcon from "src/icons/Play.icon.svg";
import { useMediaQuery } from "usehooks-ts";

interface FeaturedWorkProps {
  fields: Work;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const { fields } = props;
  const { workVideoUrl } = fields;

  const isMobile = useMediaQuery("(max-width: 768px)");

  const { featuredWorkButtonText } = useGlobalVariables();

  const { inView, ref } = useInView({
    threshold: 0.5,
  });

  return !isMobile ? (
    <div
      ref={ref}
      className={classNames(styles.featuredWork, { [styles.inView]: inView })}
    >
      <div className={styles.workOverlay}>
        <div className={styles.workOverlayText}>
          <h2>{fields.workClient}</h2>
          <p>{fields.workTitle}</p>
          <StyledButtonLink
            href={`/work/${fields.workSlug}?playVideo=true`}
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
          <VideoPlayer url={workVideoUrl} />
        </div>
      ) : null}
    </div>
  ) : (
    <WorkCard
      work={fields}
      title={fields.workClient}
      subtitle={fields.workTitle}
    />
  );
};

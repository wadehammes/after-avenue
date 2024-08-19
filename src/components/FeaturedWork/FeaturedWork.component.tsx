"use client";

import classNames from "classnames";
import { useInView } from "react-intersection-observer";
import styles from "src/components/FeaturedWork/FeaturedWork.module.css";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import type { Work } from "src/contentful/getWork";

interface FeaturedWorkProps {
  fields: Work;
}

export const FeaturedWork = (props: FeaturedWorkProps) => {
  const { fields } = props;
  const { workVideoUrl } = fields;

  const { inView, ref } = useInView({
    threshold: 0.5,
  });

  return (
    <div
      ref={ref}
      className={classNames(styles.featuredWork, { [styles.inView]: inView })}
    >
      <div className={styles.workOverlay}>
        <div className={styles.workOverlayText}>
          <h2>{fields.workTitle}</h2>
          <p>{fields.workClient}</p>
          <StyledButtonLink
            href={`/work/${fields.workSlug}`}
            variant="outlined"
            color="dark"
          >
            View Work
          </StyledButtonLink>
        </div>
      </div>
      {workVideoUrl ? (
        <div className={styles.videoContainer}>
          <VideoPlayer url={workVideoUrl} />
        </div>
      ) : null}
    </div>
  );
};

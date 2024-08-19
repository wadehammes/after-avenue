"use client";

import { useInView } from "react-intersection-observer";
import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import { Work } from "src/contentful/getWork";

interface WorkCardProps {
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { work } = props;

  const { inView, ref } = useInView({
    threshold: 0.25,
  });

  return (
    <div ref={ref} className={styles.workCard}>
      <VideoPlayer url={work.workVideoUrl} rounded playing={inView} />
      <div className={styles.workCardMeta}>
        <div className={styles.workCardTitle}>
          <h2>{work.workTitle}</h2>
          <p>{work.workClient}</p>
        </div>
        <div className={styles.workCardButtonContainer}>
          <StyledButtonLink
            href={`/work/${work.workSlug}`}
            variant="outlined"
            color="dark"
            size="small"
          >
            View Work
          </StyledButtonLink>
        </div>
      </div>
    </div>
  );
};

import StyledButtonLink from "src/components/StyledButton/StyledButtonLink.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import { Work } from "src/contentful/getWork";

interface WorkCardProps {
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { work } = props;

  return (
    <div className={styles.workCard}>
      <VideoPlayer url={work.workVideoUrl} rounded />
      <div className={styles.workCardMeta}>
        <h2>{work.workTitle}</h2>
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
  );
};

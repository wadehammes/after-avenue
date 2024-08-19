import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkEntryPage/WorkEntryPage.module.css";
import type { Work } from "src/contentful/getWork";
import { RichText } from "src/contentful/richText";

interface WorkEntryPageProps {
  workEntry: Work;
}

export const WorkEntryPage = (props: WorkEntryPageProps) => {
  const { workEntry } = props;
  const { workTitle, workVideoUrl, workDescription, workClient } = workEntry;

  return (
    <article className="container column">
      <VideoPlayer url={workVideoUrl} rounded />
      <div className={styles.workCopyContainer}>
        <h1>{workTitle}</h1>
        <p>{workClient}</p>
        {workDescription ? (
          <div>
            <RichText document={workDescription} />
          </div>
        ) : null}
      </div>
    </article>
  );
};

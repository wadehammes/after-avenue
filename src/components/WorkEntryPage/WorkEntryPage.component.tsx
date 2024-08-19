import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import styles from "src/components/WorkEntryPage/WorkEntryPage.module.css";
import type { Work } from "src/contentful/getWork";
import { RichText } from "src/contentful/richText";

interface WorkEntryPageProps {
  workEntry: Work;
  workSeries: Work[];
  recentWork: Work[];
}

export const WorkEntryPage = (props: WorkEntryPageProps) => {
  const { workEntry, workSeries, recentWork } = props;
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
        {workSeries.length > 0 ? (
          <div className={styles.workSeries}>
            <h3>More in this series</h3>
            <ul className={styles.workSeriesList}>
              {workSeries.map((work) => {
                if (!work) {
                  return null;
                }

                return (
                  <li key={work.workSlug}>
                    <WorkCard work={work} />
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className={styles.workSeries}>
            <h3>Other work</h3>
            <ul className={styles.workSeriesList}>
              {recentWork.map((work) => {
                if (!work) {
                  return null;
                }

                return (
                  <li key={work.workSlug}>
                    <WorkCard work={work} />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

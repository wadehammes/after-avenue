"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  const {
    workTitle,
    workVideoUrl,
    workDescription,
    workClient,
    workCredits,
    workEditors,
    workCategories,
    hideFromWorkFeeds,
  } = workEntry;
  const searchParams = useSearchParams();

  const playVideo = searchParams.get("playVideo");

  return (
    <article className="container column">
      <VideoPlayer
        url={workVideoUrl}
        playing={playVideo === "true"}
        rounded
        light={!playVideo}
      />
      <div className={styles.workContentContainer}>
        <div className={styles.workCopyContainer}>
          <h1>{workClient}</h1>
          <p>{workTitle}</p>
          {workDescription ? (
            <div className={styles.workDescription}>
              <RichText document={workDescription} />
            </div>
          ) : null}
          {workEditors ? (
            <div className={styles.workEditors}>
              <h3>Our Editors</h3>
              {workEditors.map((editor) => {
                if (!editor) {
                  return null;
                }

                return (
                  <div key={editor.editorSlug}>
                    <Link href={`/editors/${editor.editorSlug}`}>
                      {editor.editorName}
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : null}
          {workCategories.length ? (
            <div className={styles.workCategoriesList}>
              {workCategories.map((category) =>
                category ? (
                  <Link
                    key={category.slug}
                    className={styles.workCategory}
                    href={`/work/category/${category.slug}`}
                  >
                    {category?.categoryName}
                  </Link>
                ) : null,
              )}
            </div>
          ) : null}
        </div>
        {workCredits ? (
          <div className={styles.workCredits}>
            <h3>Credits</h3>
            <RichText document={workCredits} />
          </div>
        ) : null}
      </div>
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
                  <WorkCard
                    work={work}
                    showHoverIcon={false}
                    title={work.workTitle}
                    subtitle={work.workClient}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <>
          {!hideFromWorkFeeds ? (
            <div className={styles.workSeries}>
              <h3>Other work</h3>
              <ul className={styles.workSeriesList}>
                {recentWork.map((work) => {
                  if (!work) {
                    return null;
                  }

                  return (
                    <li key={work.workSlug}>
                      <WorkCard
                        work={work}
                        showHoverIcon={false}
                        title={work.workClient}
                        subtitle={work.workTitle}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </article>
  );
};

"use client";

import Link from "next/link";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import { WorkCard } from "src/components/WorkCard/WorkCard.component";
import styles from "src/components/WorkEntryPage/WorkEntryPage.module.css";
import type { Work } from "src/contentful/getWork";
import { RichText } from "src/contentful/richText";

interface WorkEntryPageProps {
  playVideo?: boolean;
  workEntry: Work;
  workSeries: Work[];
  recentWork: Work[];
}

export const WorkEntryPage = (props: WorkEntryPageProps) => {
  const { playVideo = false, workEntry, workSeries, recentWork } = props;
  const {
    contactFooterButtonText,
    contactFooterTitle,
    workTitle,
    workVideoUrl,
    workDescription,
    workClient,
    workCredits,
    workEditors,
    workCategories,
    hideFromWorkFeeds,
  } = workEntry;

  return (
    <article className="container column">
      <div className={styles.videoContainer}>
        <VideoPlayer
          src={workVideoUrl}
          playInView={playVideo}
          rounded
          autoPlay={playVideo}
          controls
        />
      </div>
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
          <ul className={styles.workCategoriesList}>
            {(workCategories ?? []).length > 0 &&
              (workCategories ?? []).map((category) =>
                category ? (
                  <li key={category.slug}>
                    <Link
                      className={styles.workCategory}
                      href={`/work/category/${category.slug}`}
                    >
                      {category?.categoryName}
                    </Link>
                  </li>
                ) : null,
              )}
            <li>
              <Link className={styles.workCategory} href="/">
                After Avenue Post House
              </Link>
            </li>
          </ul>
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
                    title={work.workTitle}
                    subtitle={work.workClient ?? ""}
                    autoPlay={false}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : !hideFromWorkFeeds ? (
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
                    title={work.workClient ?? ""}
                    subtitle={work.workTitle}
                    autoPlay={false}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <ContactFooter
        title={contactFooterTitle}
        buttonText={contactFooterButtonText}
      />
    </article>
  );
};

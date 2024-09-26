"use client";

import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Script from "next/script";
import type { WebPage } from "schema-dts";
import { ContactFooter } from "src/components/ContactFooter/ContactFooter.component";
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
    publishDate,
    updatedAt,
  } = workEntry;
  const searchParams = useSearchParams();

  const playVideo = searchParams.get("playVideo");

  const jsonLd: WebPage = {
    "@type": "WebPage",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 0,
          name: "Home",
        },
        {
          "@type": "ListItem",
          position: 1,
          name: "Work",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: `${workClient} - ${workTitle}`,
        },
      ],
    },
    description: workDescription
      ? documentToPlainTextString(workDescription)
      : "",
    datePublished: publishDate,
    dateModified: updatedAt,
    name: `${workClient} - ${workTitle}`,
    publisher: {
      "@type": "Organization",
      name: "After Avenue",
    },
  };

  return (
    <article className="container column">
      <Script
        id="workSchema"
        type="application/ld+json"
        strategy="beforeInteractive"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.videoContainer} aria-label={workClient}>
        <VideoPlayer
          url={workVideoUrl}
          playing={playVideo === "true"}
          rounded
          autoPlay={playVideo === "true"}
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
                    title={work.workTitle}
                    subtitle={work.workClient}
                    autoPlay={false}
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
                        title={work.workClient}
                        subtitle={work.workTitle}
                        autoPlay={false}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      )}
      <ContactFooter
        title={contactFooterTitle}
        buttonText={contactFooterButtonText}
      />
    </article>
  );
};

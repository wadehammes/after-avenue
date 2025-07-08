"use client";

import classNames from "classnames";
import Link from "next/link";
import { useState, useCallback, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "src/components/EditorsPage/EditorsPage.module.css";
import type { Editor } from "src/contentful/getEditors";
import type { Page } from "src/contentful/getPages";
import { useIsBrowser } from "src/hooks/useIsBrowser";

interface EditorsPageProps {
  pageFields: Page;
  editors: Editor[];
}

export const EditorsPage = (props: EditorsPageProps) => {
  const { editors, pageFields } = props;
  const { pageTitle } = pageFields;
  const isBrowser = useIsBrowser();
  const [currentVideoId, setCurrentVideoId] = useState<string>(
    editors[0].featuredWork?.id ?? "",
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const handleMouseEnter = useCallback((videoId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (videoId !== currentVideoId) {
        setCurrentVideoId(videoId);
      }
    }, 100); // 100ms delay to prevent rapid changes
  }, [currentVideoId]);

  if (!editors) {
    return null;
  }

  return (
    <>
      <h1 className="hidden-title">{pageTitle}</h1>
      <div className={styles.editorsPageContent}>
        <div className={styles.editorsList}>
          {editors.map((editor) => (
            <Link
              key={editor.editorSlug}
              href={`/editors/${editor.editorSlug}`}
              className={classNames(styles.editorLink, {
                [styles.activeEditor]:
                  currentVideoId === editor.featuredWork?.id,
              })}
              onMouseEnter={() =>
                handleMouseEnter(editor.featuredWork?.id ?? "")
              }
            >
              {editor.editorName}
            </Link>
          ))}
        </div>
      </div>

      {isBrowser ? (
        <div className={styles.videoBackground}>
          <div className={styles.overlay} />
          {editors.map((editor) => {
            if (!editor.featuredWork) {
              return null;
            }

            return (
              <ReactPlayer
                key={editor.editorSlug}
                style={{
                  opacity: currentVideoId === editor.featuredWork?.id ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                  zIndex: currentVideoId === editor.featuredWork?.id ? 1 : 0,
                  position: "absolute",
                  inset: 0,
                  width: "150%",
                  height: "150%",
                  transform: "translate(-25%, -25%)",
                }}
                controls={false}
                playing={currentVideoId === editor.featuredWork?.id}
                loop
                muted
                src={editor.featuredWork.workVideoUrl}
                config={{
                  youtube: {
                    playerVars: {
                      end: 60,
                      start: 30,
                    },
                  },
                  vimeo: {
                    playerOptions: {
                      end_time: 60,
                      start_time: 30,
                    },
                  },
                }}
              />
            );
          })}
          <video
            className={styles.staticVideo}
            playsInline
            loop
            preload="auto"
            autoPlay
            muted
          >
            <source src="/video/static.mp4" type="video/mp4" />
          </video>
        </div>
      ) : null}
    </>
  );
};

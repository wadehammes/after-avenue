"use client";

import classNames from "classnames";
import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  type EditorBackgroundVideo,
  EditorsBackgroundVideo,
} from "src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.component";
import styles from "src/components/EditorsPage/EditorsPage.module.css";
import type { EditorType } from "src/contentful/getEditors";
import type { Page } from "src/contentful/getPages";

interface EditorsPageProps {
  pageFields: Page;
  editors: EditorType[];
}

const toBackgroundVideo = (
  editor: EditorType,
): EditorBackgroundVideo | null => {
  const { featuredWork } = editor;

  if (!featuredWork?.id || !featuredWork.workVideoUrl) {
    return null;
  }

  return {
    editorId: featuredWork.id,
    videoSrc: featuredWork.workVideoUrl,
  };
};

export const EditorsPage = (props: EditorsPageProps) => {
  const { editors, pageFields } = props;
  const { pageTitle } = pageFields;

  const editorVideos = useMemo(
    () =>
      editors
        .map(toBackgroundVideo)
        .filter((video): video is EditorBackgroundVideo => video !== null),
    [editors],
  );

  const initialVideo = editorVideos[0] ?? null;

  const [requestedVideo, setRequestedVideo] =
    useState<EditorBackgroundVideo | null>(initialVideo);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const handleMouseEnter = useCallback((video: EditorBackgroundVideo) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setRequestedVideo(video);
    }, 150);
  }, []);

  if (!editors.length || !initialVideo || !requestedVideo) {
    return null;
  }

  return (
    <>
      <h1 className="hidden-title">{pageTitle}</h1>
      <div className={styles.editorsPageContent}>
        <div className={styles.editorsList}>
          {editors.map((editor) => {
            const video = toBackgroundVideo(editor);

            return (
              <Link
                key={editor.editorSlug}
                href={`/editors/${editor.editorSlug}`}
                className={classNames(styles.editorLink, {
                  [styles.activeEditor]:
                    requestedVideo.editorId === editor.featuredWork?.id,
                })}
                onMouseEnter={() => {
                  if (video) {
                    handleMouseEnter(video);
                  }
                }}
              >
                {editor.editorName}
              </Link>
            );
          })}
        </div>
      </div>

      <EditorsBackgroundVideo
        initialVideo={initialVideo}
        requestedVideo={requestedVideo}
      />
    </>
  );
};

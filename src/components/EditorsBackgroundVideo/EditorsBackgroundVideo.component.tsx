"use client";

import classNames from "classnames";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.module.css";
import {
  createMutedPlayerHandlers,
  editorsBackgroundPlayerConfig,
  ensureContainerMuted,
  mutedAutoplayPlayerProps,
} from "src/utils/videoPlayerConfig";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export interface EditorBackgroundVideo {
  editorId: string;
  videoSrc: string;
}

interface EditorsBackgroundVideoProps {
  initialVideo: EditorBackgroundVideo;
  requestedVideo: EditorBackgroundVideo;
}

export const EditorsBackgroundVideo = (props: EditorsBackgroundVideoProps) => {
  const { initialVideo, requestedVideo } = props;
  const [activeVideo, setActiveVideo] = useState(initialVideo);
  const [pendingVideo, setPendingVideo] =
    useState<EditorBackgroundVideo | null>(null);
  const [playing, setPlaying] = useState(true);
  const requestedVideoRef = useRef(requestedVideo);
  const activeEmbedRef = useRef<HTMLDivElement>(null);
  const preloadEmbedRef = useRef<HTMLDivElement>(null);
  const pendingVideoRef = useRef(pendingVideo);

  requestedVideoRef.current = requestedVideo;
  pendingVideoRef.current = pendingVideo;

  useEffect(() => {
    if (requestedVideo.editorId === activeVideo.editorId) {
      return;
    }

    if (pendingVideo?.editorId === requestedVideo.editorId) {
      return;
    }

    setPendingVideo(requestedVideo);
  }, [requestedVideo, activeVideo.editorId, pendingVideo?.editorId]);

  const resolvePendingVideo = useCallback((video: EditorBackgroundVideo) => {
    if (requestedVideoRef.current.editorId !== video.editorId) {
      return;
    }

    setActiveVideo(video);
    setPendingVideo(null);
    setPlaying(true);
  }, []);

  const activeMuteHandlers = useMemo(
    () =>
      createMutedPlayerHandlers(activeEmbedRef, () => {
        setPlaying(true);
      }),
    [],
  );

  const preloadMuteHandlers = useMemo(
    () =>
      createMutedPlayerHandlers(preloadEmbedRef, () => {
        const video = pendingVideoRef.current;

        if (video) {
          resolvePendingVideo(video);
        }
      }),
    [resolvePendingVideo],
  );

  useEffect(() => {
    if (!playing) {
      return;
    }

    ensureContainerMuted(activeEmbedRef.current);
    ensureContainerMuted(preloadEmbedRef.current);
  }, [playing]);

  const isLoading = pendingVideo !== null;

  return (
    <div className={styles.videoBackground}>
      <div className={styles.overlay} />
      <video
        className={classNames(styles.staticVideo, {
          [styles.staticVideoProminent]: isLoading,
        })}
        playsInline
        loop
        preload="auto"
        autoPlay
        muted
      >
        <source src="/video/static.mp4" type="video/mp4" />
      </video>
      {isLoading ? (
        <div ref={preloadEmbedRef} className={styles.preloadPlayer}>
          <ReactPlayer
            key={pendingVideo.editorId}
            className={styles.player}
            config={editorsBackgroundPlayerConfig}
            controls={false}
            loop
            playsInline
            playing
            src={pendingVideo.videoSrc}
            width="100%"
            height="100%"
            {...mutedAutoplayPlayerProps}
            {...preloadMuteHandlers}
          />
        </div>
      ) : (
        <div ref={activeEmbedRef} className={styles.playerLayer}>
          <ReactPlayer
            key={activeVideo.editorId}
            autoPlay
            className={styles.player}
            config={editorsBackgroundPlayerConfig}
            controls={false}
            loop
            playsInline
            playing={playing}
            src={activeVideo.videoSrc}
            width="100%"
            height="100%"
            {...mutedAutoplayPlayerProps}
            {...activeMuteHandlers}
          />
        </div>
      )}
    </div>
  );
};

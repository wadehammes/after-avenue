"use client";

import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.module.css";

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

const playerConfig = {
  youtube: {
    end: 60,
    start: 30,
  },
  vimeo: {
    end_time: 60,
    start_time: 30,
  },
};

export const EditorsBackgroundVideo = (props: EditorsBackgroundVideoProps) => {
  const { initialVideo, requestedVideo } = props;
  const [activeVideo, setActiveVideo] = useState(initialVideo);
  const [pendingVideo, setPendingVideo] =
    useState<EditorBackgroundVideo | null>(null);
  const requestedVideoRef = useRef(requestedVideo);

  requestedVideoRef.current = requestedVideo;

  useEffect(() => {
    if (requestedVideo.editorId === activeVideo.editorId) {
      setPendingVideo(null);
      return;
    }

    if (pendingVideo?.editorId === requestedVideo.editorId) {
      return;
    }

    setPendingVideo(requestedVideo);
  }, [requestedVideo, activeVideo.editorId, pendingVideo?.editorId]);

  const resolvePendingVideo = (video: EditorBackgroundVideo) => {
    if (requestedVideoRef.current.editorId !== video.editorId) {
      return;
    }

    setActiveVideo(video);
    setPendingVideo(null);
  };

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
        <div className={styles.preloadPlayer}>
          <ReactPlayer
            key={pendingVideo.editorId}
            className={styles.player}
            config={playerConfig}
            controls={false}
            loop
            muted
            onReady={() => {
              resolvePendingVideo(pendingVideo);
            }}
            onStart={() => {
              resolvePendingVideo(pendingVideo);
            }}
            playsInline
            playing
            src={pendingVideo.videoSrc}
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <div className={styles.playerLayer}>
          <ReactPlayer
            key={activeVideo.editorId}
            className={styles.player}
            config={playerConfig}
            controls={false}
            loop
            muted
            playsInline
            playing
            src={activeVideo.videoSrc}
            width="100%"
            height="100%"
          />
        </div>
      )}
    </div>
  );
};

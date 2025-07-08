"use client";

import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import { useIsBrowser } from "src/hooks/useIsBrowser";

interface VideoPlayerProps {
  autoPlay?: boolean;
  controls?: boolean;
  playInView?: boolean;
  rounded?: boolean;
  src: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    autoPlay = false,
    controls = false,
    playInView = false,
    rounded = false,
    src,
  } = props;
  const isBrowser = useIsBrowser();
  const [debouncedPlayInView, setDebouncedPlayInView] = useState(playInView);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedPlayInView(playInView);
    }, 200); // 200ms delay to prevent rapid play/pause

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playInView]);

  if (!isBrowser) {
    return null;
  }

  return (
    <div
      className={classNames(styles.videoPlayer, {
        [styles.rounded]: rounded,
      })}
    >
      <ReactPlayer
        controls={controls}
        loop
        muted
        src={src}
        playing={autoPlay && debouncedPlayInView}
        width="100%"
        height="100%"
        config={{
          youtube: {
            playerVars: {
              controls: controls ? 1 : 0,
              disablekb: !controls,
              fs: controls ? 1 : 0,
              iv_load_policy: 3,
              modestbranding: 1,
              rel: 0,
              showinfo: 0,
            },
          },
          vimeo: {
            playerOptions: {
              controls: controls,
              autopause: !autoPlay,
              background: false,
              dnt: true,
              responsive: true,
              title: 0,
            },
          },
        }}
      />
    </div>
  );
};

"use client";

import classNames from "classnames";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => <div className={styles.videoPlayer} />,
});

interface VideoPlayerProps {
  autoPlay?: boolean;
  controls?: boolean;
  light?: boolean;
  playInView?: boolean;
  rounded?: boolean;
  src: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    autoPlay = false,
    controls = false,
    light = false,
    playInView = false,
    rounded = false,
    src,
  } = props;
  const [debouncedPlayInView, setDebouncedPlayInView] = useState(playInView);
  const [isReady, setIsReady] = useState(light);
  const [hasActivatedLightPlayer, setHasActivatedLightPlayer] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const srcRef = useRef(src);

  useEffect(() => {
    if (srcRef.current !== src) {
      srcRef.current = src;
      setHasActivatedLightPlayer(false);
      setIsReady(light);
    }
  }, [light, src]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!playInView) {
      setDebouncedPlayInView(false);
    } else {
      timeoutRef.current = setTimeout(() => {
        setDebouncedPlayInView(true);
      }, 300);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playInView]);

  return (
    <div
      className={classNames(styles.videoPlayer, {
        [styles.rounded]: rounded,
      })}
    >
      <div className={styles.videoPlayerEmbed}>
        <ReactPlayer
          controls={controls}
          light={light}
          loop
          muted
          onClickPreview={() => {
            setHasActivatedLightPlayer(true);
            setIsReady(false);
          }}
          onReady={() => {
            setIsReady(true);
          }}
          playsInline
          src={src}
          playing={autoPlay && debouncedPlayInView}
          width="100%"
          height="100%"
          config={{
            youtube: {
              disablekb: !controls ? 1 : 0,
              fs: controls ? 1 : 0,
              iv_load_policy: 3,
              rel: 0,
            },
            vimeo: {
              controls: controls,
              autopause: !autoPlay,
              background: false,
              dnt: true,
              responsive: true,
              title: false,
            },
          }}
        />
      </div>
      {light && !hasActivatedLightPlayer ? null : (
        <div
          aria-hidden="true"
          className={classNames(styles.loadingOverlay, {
            [styles.hidden]: isReady,
          })}
        />
      )}
    </div>
  );
};

"use client";

import classNames from "classnames";
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
        playing={autoPlay && playInView}
        width="100%"
        height="100%"
      />
    </div>
  );
};

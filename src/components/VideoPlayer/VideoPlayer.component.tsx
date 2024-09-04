"use client";

import classNames from "classnames";
import ReactPlayer from "react-player";
import { Loader } from "src/components/Loader/Loader.component";
import { PlayIcon } from "src/components/VideoPlayer/PlayIcon.component";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import { useIsBrowser } from "src/hooks/useIsBrowser";

interface VideoPlayerProps {
  inView?: boolean;
  light?: boolean;
  playing?: boolean;
  rounded?: boolean;
  url: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    url,
    rounded = false,
    playing = true,
    light = false,
    inView = false,
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
        controls={rounded}
        url={url}
        playing={playing}
        loop
        muted
        fallback={<Loader />}
        light={light && !inView}
        playIcon={<PlayIcon />}
      />
    </div>
  );
};

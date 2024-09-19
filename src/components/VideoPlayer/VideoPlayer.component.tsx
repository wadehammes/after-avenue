"use client";

import classNames from "classnames";
import ReactPlayer from "react-player";
import { Loader } from "src/components/Loader/Loader.component";
import { PlayIcon } from "src/components/VideoPlayer/PlayIcon.component";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";
import { useIsBrowser } from "src/hooks/useIsBrowser";
import useWindowFocus from "src/hooks/useWindowFocus";

interface VideoPlayerProps {
  autoPlay?: boolean;
  controls?: boolean;
  playing?: boolean;
  rounded?: boolean;
  url: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    autoPlay = true,
    controls = false,
    playing = true,
    rounded = false,
    url,
  } = props;
  const isBrowser = useIsBrowser();
  const isFocused = useWindowFocus();

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
        fallback={<Loader />}
        light={!autoPlay}
        loop={isFocused}
        muted
        playIcon={<PlayIcon />}
        playing={playing && isFocused}
        url={url}
        volume={0}
      />
    </div>
  );
};

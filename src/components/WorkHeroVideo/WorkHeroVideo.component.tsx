"use client";

import classNames from "classnames";
import { useState } from "react";
import { LazyReactPlayer } from "src/components/LazyReactPlayer/LazyReactPlayer.component";
import styles from "src/components/WorkHeroVideo/WorkHeroVideo.module.css";
import { controlsPlayerConfig } from "src/utils/videoPlayerConfig";

interface WorkHeroVideoProps {
  playing?: boolean;
  rounded?: boolean;
  src: string;
}

export const WorkHeroVideo = (props: WorkHeroVideoProps) => {
  const { playing = false, rounded = false, src } = props;
  const [isReady, setIsReady] = useState(false);

  const markReady = () => {
    setIsReady(true);
  };

  if (!src) {
    return null;
  }

  return (
    <div
      className={classNames(styles.heroVideo, {
        [styles.rounded]: rounded,
      })}
    >
      <div className={styles.heroVideoEmbed}>
        <LazyReactPlayer
          autoPlay={playing}
          config={controlsPlayerConfig}
          controls
          loop
          muted={playing}
          onReady={markReady}
          onStart={markReady}
          playsInline
          playing={playing}
          src={src}
          volume={playing ? 0 : undefined}
          width="100%"
          height="100%"
        />
      </div>
      <div
        aria-hidden="true"
        className={classNames(styles.loadingOverlay, {
          [styles.hidden]: isReady,
        })}
      />
    </div>
  );
};

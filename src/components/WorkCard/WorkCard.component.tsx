"use client";

import classNames from "classnames";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import type { Work } from "src/contentful/getWork";
import { useVideoInView } from "src/hooks/useVideoInView";
import ArrowDownIcon from "src/icons/ArrowDown.svg";
import scrollEntrance from "src/styles/scrollEntrance.module.css";

interface WorkCardProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  controls?: boolean;
  subtitle: string;
  title: string;
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { autoPlay = false, controls = true, work, title, subtitle } = props;
  const { hasAnimated, inView, setRef } = useVideoInView({
    triggerOnce: false,
  });

  return (
    <div
      ref={setRef}
      className={classNames(styles.workCard, scrollEntrance.enter, {
        [scrollEntrance.animate]: hasAnimated,
      })}
    >
      <div className={styles.workCardVideoContainer}>
        {inView && work.workVideoUrl ? (
          <VideoPlayer
            autoPlay={autoPlay}
            controls={controls}
            light={!autoPlay}
            rounded
            src={work.workVideoUrl}
          />
        ) : null}
      </div>

      <Link
        href={`/work/${work.workSlug}/?playVideo=true`}
        className={styles.workCardMeta}
      >
        <div className={styles.workCardTitle}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <div className={styles.workCardPlayIconContainer}>
          <ArrowDownIcon />
        </div>
      </Link>
    </div>
  );
};

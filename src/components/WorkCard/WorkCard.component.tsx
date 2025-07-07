"use client";

import classNames from "classnames";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { useInView } from "react-intersection-observer";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import type { Work } from "src/contentful/getWork";
import ArrowDownIcon from "src/icons/ArrowDown.svg";

interface WorkCardProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  controls?: boolean;
  subtitle: string;
  title: string;
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { autoPlay = false, controls = true, work, title, subtitle } = props;

  const { inView, ref } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={classNames(styles.workCard, { [styles.animate]: inView })}
    >
      <div className={styles.workCardVideoContainer}>
        <VideoPlayer
          autoPlay={autoPlay}
          controls={controls}
          rounded
          src={work.workVideoUrl}
        />
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

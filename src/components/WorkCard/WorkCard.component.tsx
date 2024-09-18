"use client";

import classNames from "classnames";
import Link from "next/link";
import { HTMLAttributes } from "react";
import { useInView } from "react-intersection-observer";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import { Work } from "src/contentful/getWork";
import ArrowDownIcon from "src/icons/ArrowDown.svg";

interface WorkCardProps extends HTMLAttributes<HTMLDivElement> {
  work: Work;
  title: string;
  subtitle: string;
  autoPlay?: boolean;
}

export const WorkCard = (props: WorkCardProps) => {
  const { autoPlay, work, title, subtitle } = props;

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
          url={work.workVideoUrl}
          rounded
          playing={inView}
          autoPlay={autoPlay}
        />
      </div>

      <Link
        href={`/work/${work.workSlug}?playVideo=true`}
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

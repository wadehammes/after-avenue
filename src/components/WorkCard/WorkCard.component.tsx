"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import type { Work } from "src/contentful/getWork";
import ArrowDownIcon from "src/icons/ArrowDown.svg";
import { VIDEO_MOUNT_ROOT_MARGIN } from "src/utils/constants";

interface WorkCardProps extends HTMLAttributes<HTMLDivElement> {
  autoPlay?: boolean;
  controls?: boolean;
  subtitle: string;
  title: string;
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { autoPlay = false, controls = true, work, title, subtitle } = props;
  const [hasMounted, setHasMounted] = useState(false);

  const { inView, ref } = useInView({
    rootMargin: VIDEO_MOUNT_ROOT_MARGIN,
    threshold: 0,
    triggerOnce: true,
    onChange: (visible) => {
      if (visible) {
        setHasMounted(true);
      }
    },
  });

  return (
    <div ref={ref} className={styles.workCard}>
      <div className={styles.workCardVideoContainer}>
        {hasMounted && work.workVideoUrl ? (
          <VideoPlayer
            autoPlay={autoPlay}
            controls={controls}
            playInView={inView}
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

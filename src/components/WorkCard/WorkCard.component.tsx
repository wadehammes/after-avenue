"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import type { HTMLAttributes } from "react";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "src/components/WorkCard/WorkCard.module.css";
import type { Work } from "src/contentful/getWork";
import ArrowDownIcon from "src/icons/ArrowDown.svg";
import { VIDEO_MOUNT_ROOT_MARGIN } from "src/utils/constants";
import { controlsPlayerConfig } from "src/utils/videoPlayerConfig";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

interface WorkCardProps extends HTMLAttributes<HTMLDivElement> {
  subtitle: string;
  title: string;
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { work, title, subtitle } = props;
  const [hasMounted, setHasMounted] = useState(false);

  const { ref } = useInView({
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
          <div className={styles.workCardVideoEmbed}>
            <ReactPlayer
              config={controlsPlayerConfig}
              controls
              loop
              muted
              playsInline
              src={work.workVideoUrl}
              width="100%"
              height="100%"
            />
          </div>
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

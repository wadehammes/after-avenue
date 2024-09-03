"use client";

import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { VideoPlayer } from "src/components/VideoPlayer/VideoPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import { Work } from "src/contentful/getWork";
import ArrowDownIcon from "src/icons/ArrowDown.svg";

interface WorkCardProps {
  work: Work;
  title: string;
  subtitle: string;
  showHoverIcon?: boolean;
}

export const WorkCard = (props: WorkCardProps) => {
  const { work, title, subtitle, showHoverIcon = true } = props;

  const { inView, ref } = useInView({
    threshold: 0.25,
  });

  return (
    <div ref={ref} className={styles.workCard}>
      <VideoPlayer url={work.workVideoUrl} rounded playing={inView} light />
      <Link
        href={`/work/${work.workSlug}?playVideo=true`}
        className={styles.workCardMeta}
      >
        <div className={styles.workCardTitle}>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {showHoverIcon ? (
          <div className={styles.workCardPlayIconContainer}>
            <ArrowDownIcon />
          </div>
        ) : null}
      </Link>
    </div>
  );
};

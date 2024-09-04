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
  showHoverIcon?: boolean;
  index?: number;
}

export const WorkCard = (props: WorkCardProps) => {
  const {
    work,
    title,
    subtitle,
    showHoverIcon = true,
    index = 0,
    ...rest
  } = props;

  const { inView, ref } = useInView({
    threshold: 0.25,
    triggerOnce: true,
  });

  return (
    <div
      ref={ref}
      className={classNames(styles.workCard, { [styles.animate]: inView })}
      style={{ animationDelay: `${index * 0.2}s` }}
      {...rest}
    >
      <div className={styles.workCardVideoContainer}>
        <VideoPlayer url={work.workVideoUrl} rounded playing={inView} light />
      </div>

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

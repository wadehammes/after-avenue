"use client";

import Link from "next/link";
import type { HTMLAttributes, ReactElement } from "react";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { LazyReactPlayer } from "src/components/LazyReactPlayer/LazyReactPlayer.component";
import styles from "src/components/WorkCard/WorkCard.module.css";
import type { Work } from "src/contentful/getWork";
import ArrowDownIcon from "src/icons/ArrowDown.svg";
import { VIDEO_MOUNT_ROOT_MARGIN } from "src/utils/constants";
import { controlsPlayerConfig } from "src/utils/videoPlayerConfig";

interface WorkCardProps extends HTMLAttributes<HTMLDivElement> {
  subtitle: string;
  title: string;
  work: Work;
}

export const WorkCard = (props: WorkCardProps) => {
  const { work, title, subtitle } = props;
  const [hasMounted, setHasMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [showPreviewChrome, setShowPreviewChrome] = useState(true);

  const { inView, ref } = useInView({
    rootMargin: VIDEO_MOUNT_ROOT_MARGIN,
    threshold: 0,
    triggerOnce: false,
  });

  const loadingFallback = useMemo(
    (): ReactElement => <div className={styles.workCardVideoLightPreview} />,
    [],
  );

  useEffect(() => {
    if (inView) {
      setHasMounted(true);
    }
  }, [inView]);

  return (
    <div ref={ref} className={styles.workCard}>
      <div className={styles.workCardVideoContainer}>
        {hasMounted && work.workVideoUrl ? (
          <div className={styles.workCardVideoEmbed}>
            <LazyReactPlayer
              config={controlsPlayerConfig}
              controls
              light
              loadingFallback={loadingFallback}
              loop
              onClickPreview={() => {
                setPlaying(true);
              }}
              onPlaying={() => {
                setShowPreviewChrome(false);
              }}
              onStart={() => {
                setShowPreviewChrome(false);
              }}
              playsInline
              playing={playing}
              src={work.workVideoUrl}
              width="100%"
              height="100%"
            />
            {showPreviewChrome ? (
              <div
                aria-hidden="true"
                className={styles.workCardVideoPreviewChrome}
              >
                <div className={styles.workCardVideoDotOverlay} />
                <div className={styles.workCardVideoPlayAffordance}>
                  <span className={styles.workCardVideoPlayTriangle} />
                </div>
              </div>
            ) : null}
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

"use client";

import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player";
import type { Config } from "react-player/types";
import styles from "src/components/VideoPlayer/VideoPlayer.module.css";

const youtubeFlag = (enabled: boolean): 0 | 1 => (enabled ? 1 : 0);

type VimeoPlayerElement = HTMLVideoElement & {
  api?: {
    pause?: () => Promise<void>;
    play?: () => Promise<void>;
    setMuted?: (muted: boolean) => Promise<void>;
    setVolume?: (volume: number) => Promise<void>;
  };
  paused?: boolean;
  play?: () => Promise<void>;
};

interface VideoPlayerProps {
  autoPlay?: boolean;
  className?: string;
  controls?: boolean;
  light?: boolean;
  onEmbedReady?: () => void;
  playInView?: boolean;
  /** Delay before starting playback when `playInView` becomes true (default 300ms). */
  playInViewDelayMs?: number;
  rounded?: boolean;
  src: string;
}

export const VideoPlayer = (props: VideoPlayerProps) => {
  const {
    autoPlay = false,
    className,
    controls = false,
    light = false,
    onEmbedReady,
    playInView = false,
    playInViewDelayMs = 300,
    rounded = false,
    src,
  } = props;

  const isReel = autoPlay && !controls;
  const [debouncedPlayInView, setDebouncedPlayInView] = useState(playInView);
  const [isReady, setIsReady] = useState(light);
  const [hasActivatedLightPlayer, setHasActivatedLightPlayer] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const srcRef = useRef(src);
  const playerRef = useRef<VimeoPlayerElement | null>(null);
  const onEmbedReadyRef = useRef(onEmbedReady);

  onEmbedReadyRef.current = onEmbedReady;

  const shouldPlay =
    autoPlay && (playInViewDelayMs === 0 ? playInView : debouncedPlayInView);

  const enforceReelMuted = useCallback(() => {
    if (!isReel) {
      return;
    }

    const player = playerRef.current;

    if (!player) {
      return;
    }

    player.muted = true;
    player.volume = 0;
    void player.api?.setMuted?.(true)?.catch(() => undefined);
    void player.api?.setVolume?.(0)?.catch(() => undefined);
  }, [isReel]);

  const pausePlayer = useCallback(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    void player.pause?.();
    void player.api?.pause?.()?.catch(() => undefined);
  }, []);

  const nudgePlay = useCallback(() => {
    if (!shouldPlay) {
      return;
    }

    const player = playerRef.current;

    if (!player) {
      return;
    }

    enforceReelMuted();

    if (player.paused) {
      void player.play?.()?.catch(() => undefined);
      void player.api?.play?.()?.catch(() => undefined);
    }
  }, [enforceReelMuted, shouldPlay]);

  const playerConfig = useMemo((): Config => {
    return {
      youtube: {
        disablekb: youtubeFlag(!controls),
        fs: youtubeFlag(controls),
        iv_load_policy: 3,
        rel: 0,
      },
      vimeo: {
        controls: controls,
        autopause: !autoPlay,
        background: false,
        dnt: true,
        responsive: true,
        title: false,
      },
    };
  }, [autoPlay, controls]);

  useEffect(() => {
    if (srcRef.current !== src) {
      srcRef.current = src;
      setHasActivatedLightPlayer(false);
      setIsReady(light);
    }
  }, [light, src]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!playInView) {
      setDebouncedPlayInView(false);
    } else {
      timeoutRef.current = setTimeout(() => {
        setDebouncedPlayInView(true);
      }, playInViewDelayMs);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [playInView, playInViewDelayMs]);

  useEffect(() => {
    if (shouldPlay) {
      nudgePlay();
    } else {
      pausePlayer();
    }
  }, [nudgePlay, pausePlayer, shouldPlay]);

  useEffect(() => {
    return () => {
      pausePlayer();
    };
  }, [pausePlayer]);

  const showLoadingOverlay = !light && !isReel && !(controls && !autoPlay);

  return (
    <div
      className={classNames(styles.videoPlayer, className, {
        [styles.rounded]: rounded,
      })}
    >
      <div className={styles.videoPlayerEmbed}>
        <ReactPlayer
          ref={playerRef}
          autoPlay={autoPlay}
          controls={controls}
          light={light}
          loop
          muted
          onClickPreview={() => {
            setHasActivatedLightPlayer(true);
            setIsReady(false);
          }}
          onPlay={() => {
            enforceReelMuted();
          }}
          onPlaying={() => {
            enforceReelMuted();
          }}
          onReady={() => {
            setIsReady(true);
            nudgePlay();
            onEmbedReadyRef.current?.();
          }}
          onStart={() => {
            if (autoPlay) {
              setIsReady(true);
            }
          }}
          playsInline
          src={src}
          playing={shouldPlay}
          volume={isReel ? 0 : undefined}
          width="100%"
          height="100%"
          config={playerConfig}
        />
      </div>
      {light && !hasActivatedLightPlayer ? null : showLoadingOverlay ? (
        <div
          aria-hidden="true"
          className={classNames(styles.loadingOverlay, {
            [styles.hidden]: isReady,
            [styles.instantHide]: autoPlay && isReady,
          })}
        />
      ) : null}
    </div>
  );
};

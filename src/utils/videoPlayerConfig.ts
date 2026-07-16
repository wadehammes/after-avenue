import type { RefObject } from "react";
import type { Config } from "react-player/types";

type VimeoConfigWithMutedParam = NonNullable<Config["vimeo"]> & {
  muted?: number;
};
type YoutubeConfigWithMuteParam = NonNullable<Config["youtube"]> & {
  mute?: number;
};

const vimeoConfig = (config: VimeoConfigWithMutedParam) =>
  config as Config["vimeo"];

const youtubeConfig = (config: YoutubeConfigWithMuteParam) =>
  config as Config["youtube"];

interface MuteablePlayer extends Element {
  defaultMuted?: boolean;
  muted?: boolean;
  volume?: number;
}

export const mutedAutoplayPlayerProps = {
  muted: true,
  volume: 0,
} as const;

const findPlayerElement = (
  container: HTMLElement | null,
): MuteablePlayer | null => {
  if (!container) {
    return null;
  }

  return container.querySelector("vimeo-video, youtube-video");
};

const ensurePlayerMuted = (player: MuteablePlayer | null | undefined) => {
  if (!player) {
    return;
  }

  player.setAttribute("muted", "");

  if ("defaultMuted" in player) {
    player.defaultMuted = true;
  }

  player.muted = true;
  player.volume = 0;
};

export const ensureContainerMuted = (container: HTMLElement | null) => {
  ensurePlayerMuted(findPlayerElement(container));
};

export const createMutedPlayerHandlers = (
  containerRef: RefObject<HTMLElement | null>,
  onReady?: () => void,
) => {
  const enforce = () => {
    ensureContainerMuted(containerRef.current);
  };

  return {
    onPlay: enforce,
    onReady: () => {
      enforce();
      onReady?.();
    },
    onStart: () => {
      enforce();
      onReady?.();
    },
  };
};

export const reelPlayerConfig: Config = {
  vimeo: vimeoConfig({
    autopause: false,
    background: true,
    controls: false,
    dnt: true,
    muted: 1,
    responsive: true,
    title: false,
    unmute_button: false,
  }),
  youtube: youtubeConfig({
    disablekb: 1,
    fs: 0,
    iv_load_policy: 3,
    mute: 1,
    rel: 0,
  }),
};

export const editorsBackgroundPlayerConfig: Config = {
  vimeo: vimeoConfig({
    background: true,
    controls: false,
    end_time: 60,
    muted: 1,
    start_time: 30,
    unmute_button: false,
  }),
  youtube: youtubeConfig({
    end: 60,
    mute: 1,
    start: 30,
  }),
};

export const controlsPlayerConfig: Config = {
  vimeo: {
    autopause: true,
    background: false,
    controls: true,
    dnt: true,
    responsive: true,
    title: false,
  },
  youtube: {
    disablekb: 0,
    fs: 1,
    iv_load_policy: 3,
    rel: 0,
  },
};

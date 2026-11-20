import { describe, expect, it, jest } from "@jest/globals";
import { createEmbedMediaDomFixture } from "src/tests/helpers/embedMediaTest.helpers";
import {
  getEmbedMediaController,
  observeEmbedLifecycle,
} from "src/utils/videoPlayerConfig";

describe("videoPlayerConfig", () => {
  it("getEmbedMediaController returns play and pause when the embed exposes them", () => {
    const { container, embed } = createEmbedMediaDomFixture();
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    Object.assign(embed, { play, pause });

    const controller = getEmbedMediaController(container);

    expect(controller).not.toBeNull();
    void controller?.play();
    void controller?.pause();
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
  });

  it("observeEmbedLifecycle forwards loadcomplete and playing", () => {
    const { container, embed } = createEmbedMediaDomFixture();
    const onLoadComplete = jest.fn();
    const onPlaying = jest.fn();

    const disconnect = observeEmbedLifecycle(container, {
      onLoadComplete,
      onPlaying,
    });

    embed.dispatchEvent(new Event("loadcomplete"));
    embed.dispatchEvent(new Event("playing"));

    expect(onLoadComplete).toHaveBeenCalledTimes(1);
    expect(onPlaying).toHaveBeenCalledTimes(1);

    disconnect();
  });
});

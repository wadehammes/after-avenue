import { describe, expect, it, jest } from "@jest/globals";
import { useFeaturedReelMedia } from "src/components/FeaturedWork/useFeaturedReelMedia";
import { act, renderHook } from "src/tests/test-utils";

describe("useFeaturedReelMedia", () => {
  it("calls play on the media element when active", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const mediaElement = { play, pause };

    renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        getMediaElement: () => mediaElement,
      }),
    );

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
  });

  it("calls play when onMediaReady runs while active after the embed mounts", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    let mediaElement: { play: typeof play; pause: typeof pause } | null = null;

    const { result } = renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        getMediaElement: () => mediaElement,
      }),
    );

    expect(play).not.toHaveBeenCalled();

    mediaElement = { play, pause };

    act(() => {
      result.current.onMediaReady();
    });

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("calls pause when inactive", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const mediaElement = { play, pause };

    renderHook(() =>
      useFeaturedReelMedia({
        active: false,
        getMediaElement: () => mediaElement,
      }),
    );

    expect(pause).toHaveBeenCalledTimes(1);
    expect(play).not.toHaveBeenCalled();
  });

  it("remounts once on error", () => {
    const mediaElement = {
      play: jest.fn(async () => {}),
      pause: jest.fn(async () => {}),
    };

    const { result } = renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        getMediaElement: () => mediaElement,
      }),
    );

    act(() => {
      result.current.onError();
    });

    expect(result.current.remountKey).toBe(1);

    act(() => {
      result.current.onError();
    });

    expect(result.current.remountKey).toBe(1);
  });
});

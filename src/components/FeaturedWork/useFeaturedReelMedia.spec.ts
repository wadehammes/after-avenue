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

  it("debounces pause when becoming inactive", () => {
    jest.useFakeTimers();
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const mediaElement = { play, pause };

    const { rerender } = renderHook(
      ({ active }: { active: boolean }) =>
        useFeaturedReelMedia({
          active,
          getMediaElement: () => mediaElement,
        }),
      { initialProps: { active: true } },
    );

    expect(play).toHaveBeenCalled();

    rerender({ active: false });

    expect(pause).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(pause).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("keeps hasStartedPlayback latched when active toggles off", () => {
    jest.useFakeTimers();
    const container = document.createElement("div");
    const embed = document.createElement("vimeo-video");
    container.appendChild(embed);

    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) =>
        useFeaturedReelMedia({
          active,
          embedContainerRef: { current: container },
          embedEventsEnabled: true,
          getMediaElement: () => ({
            play: jest.fn(async () => {}),
            pause: jest.fn(async () => {}),
          }),
        }),
      { initialProps: { active: true } },
    );

    act(() => {
      embed.dispatchEvent(new Event("playing"));
    });

    expect(result.current.hasStartedPlayback).toBe(true);

    rerender({ active: false });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current.hasStartedPlayback).toBe(true);
    jest.useRealTimers();
  });

  it("calls onEmbedCanPlay only after playing, not on loadcomplete alone", () => {
    const onEmbedCanPlay = jest.fn();
    const container = document.createElement("div");
    const embed = document.createElement("vimeo-video");
    container.appendChild(embed);

    renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        embedContainerRef: { current: container },
        embedEventsEnabled: true,
        getMediaElement: () => ({
          play: jest.fn(async () => {}),
          pause: jest.fn(async () => {}),
        }),
        onEmbedCanPlay,
      }),
    );

    act(() => {
      embed.dispatchEvent(new Event("loadcomplete"));
    });

    expect(onEmbedCanPlay).not.toHaveBeenCalled();

    act(() => {
      embed.dispatchEvent(new Event("playing"));
    });

    expect(onEmbedCanPlay).toHaveBeenCalledTimes(1);
  });

  it("sets hasStartedPlayback after the embed fires playing", () => {
    const container = document.createElement("div");
    const embed = document.createElement("vimeo-video");
    container.appendChild(embed);

    const { result } = renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        embedContainerRef: { current: container },
        embedEventsEnabled: true,
        getMediaElement: () => ({
          play: jest.fn(async () => {}),
          pause: jest.fn(async () => {}),
        }),
      }),
    );

    expect(result.current.hasStartedPlayback).toBe(false);

    act(() => {
      embed.dispatchEvent(new Event("playing"));
    });

    expect(result.current.hasStartedPlayback).toBe(true);
  });

  it("calls play when the embed dispatches loadcomplete", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const container = document.createElement("div");
    const embed = document.createElement("vimeo-video");
    container.appendChild(embed);

    renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        embedContainerRef: { current: container },
        embedEventsEnabled: true,
        getMediaElement: () => ({ play, pause }),
      }),
    );

    play.mockClear();

    act(() => {
      embed.dispatchEvent(new Event("loadcomplete"));
    });

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("retries play on player error instead of remounting", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const mediaElement = { play, pause };

    const { result } = renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        getMediaElement: () => mediaElement,
      }),
    );

    const callsBefore = play.mock.calls.length;

    act(() => {
      result.current.onError();
    });

    expect(play.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(result.current).not.toHaveProperty("remountKey");
  });
});

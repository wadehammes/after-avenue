import { describe, expect, it, jest } from "@jest/globals";
import { useFeaturedReelMedia } from "src/components/FeaturedWork/useFeaturedReelMedia";
import {
  createEmbedMediaDomFixture,
  createMockEmbedMediaController,
} from "src/tests/helpers/embedMediaTest.helpers";
import { act, renderHook } from "src/tests/test-utils";
import {
  FEATURED_REEL_PAUSE_WHEN_OFF_SCREEN_MS,
  FEATURED_REEL_PLAY_WHEN_ON_SCREEN_MS,
} from "src/utils/constants";

describe("useFeaturedReelMedia", () => {
  it("calls play on the media element when active after the play delay", () => {
    jest.useFakeTimers();
    const { pause, play } = createMockEmbedMediaController();

    renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        getMediaElement: () => ({ play, pause }),
      }),
    );

    expect(play).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(FEATURED_REEL_PLAY_WHEN_ON_SCREEN_MS);
    });

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it("debounces pause when becoming inactive", () => {
    jest.useFakeTimers();
    const { pause, play } = createMockEmbedMediaController();

    const { rerender } = renderHook(
      ({ active }: { active: boolean }) =>
        useFeaturedReelMedia({
          active,
          getMediaElement: () => ({ play, pause }),
        }),
      { initialProps: { active: true } },
    );

    act(() => {
      jest.advanceTimersByTime(FEATURED_REEL_PLAY_WHEN_ON_SCREEN_MS);
    });

    expect(play).toHaveBeenCalled();

    rerender({ active: false });

    expect(pause).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(FEATURED_REEL_PAUSE_WHEN_OFF_SCREEN_MS);
    });

    expect(pause).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("keeps hasStartedPlayback latched when active toggles off", () => {
    jest.useFakeTimers();
    const { embed, containerRef } = createEmbedMediaDomFixture();
    const { pause, play } = createMockEmbedMediaController();

    const { result, rerender } = renderHook(
      ({ active }: { active: boolean }) =>
        useFeaturedReelMedia({
          active,
          embedContainerRef: containerRef,
          embedEventsEnabled: true,
          getMediaElement: () => ({ play, pause }),
        }),
      { initialProps: { active: true } },
    );

    act(() => {
      embed.dispatchEvent(new Event("playing"));
    });

    expect(result.current.hasStartedPlayback).toBe(true);

    rerender({ active: false });

    act(() => {
      jest.advanceTimersByTime(FEATURED_REEL_PAUSE_WHEN_OFF_SCREEN_MS);
    });

    expect(result.current.hasStartedPlayback).toBe(true);
    jest.useRealTimers();
  });

  it("calls onEmbedCanPlay only after playing, not on loadcomplete alone", () => {
    const onEmbedCanPlay = jest.fn();
    const { embed, containerRef } = createEmbedMediaDomFixture();
    const { pause, play } = createMockEmbedMediaController();

    renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        embedContainerRef: containerRef,
        embedEventsEnabled: true,
        getMediaElement: () => ({ play, pause }),
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
    const { containerRef, embed } = createEmbedMediaDomFixture();
    const { pause, play } = createMockEmbedMediaController();

    const { result } = renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        embedContainerRef: containerRef,
        embedEventsEnabled: true,
        getMediaElement: () => ({ play, pause }),
      }),
    );

    expect(result.current.hasStartedPlayback).toBe(false);

    act(() => {
      embed.dispatchEvent(new Event("playing"));
    });

    expect(result.current.hasStartedPlayback).toBe(true);
  });

  it("calls play when the embed dispatches loadcomplete", () => {
    jest.useFakeTimers();
    const { embed, containerRef } = createEmbedMediaDomFixture();
    const { pause, play } = createMockEmbedMediaController();

    renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        embedContainerRef: containerRef,
        embedEventsEnabled: true,
        getMediaElement: () => ({ play, pause }),
      }),
    );

    play.mockClear();

    act(() => {
      embed.dispatchEvent(new Event("loadcomplete"));
    });

    expect(play).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("retries play on player error instead of remounting", () => {
    jest.useFakeTimers();
    const { pause, play } = createMockEmbedMediaController();

    const { result } = renderHook(() =>
      useFeaturedReelMedia({
        active: true,
        getMediaElement: () => ({ play, pause }),
      }),
    );

    act(() => {
      jest.advanceTimersByTime(FEATURED_REEL_PLAY_WHEN_ON_SCREEN_MS);
    });

    const callsBefore = play.mock.calls.length;

    act(() => {
      result.current.onError();
    });

    expect(play.mock.calls.length).toBeGreaterThan(callsBefore);
    expect(result.current).not.toHaveProperty("remountKey");
    jest.useRealTimers();
  });
});

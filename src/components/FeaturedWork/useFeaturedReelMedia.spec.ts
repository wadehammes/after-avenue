import { describe, expect, it, jest } from "@jest/globals";
import { createRef } from "react";
import { useFeaturedReelMedia } from "src/components/FeaturedWork/useFeaturedReelMedia";
import { act, renderHook } from "src/tests/test-utils";

describe("useFeaturedReelMedia", () => {
  it("calls play once when becoming active", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const container = document.createElement("div");
    const mediaElement = document.createElement("vimeo-video");
    Object.assign(mediaElement, { play, pause, readyState: 4 });
    container.append(mediaElement);
    const containerRef = createRef<HTMLDivElement>();
    containerRef.current = container;

    renderHook(() => useFeaturedReelMedia({ active: true, containerRef }));

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
  });

  it("does not call play again when active stays true across rerenders", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const container = document.createElement("div");
    const mediaElement = document.createElement("vimeo-video");
    Object.assign(mediaElement, { play, pause, readyState: 4 });
    container.append(mediaElement);
    const containerRef = createRef<HTMLDivElement>();
    containerRef.current = container;

    const { rerender } = renderHook(
      ({ active }) => useFeaturedReelMedia({ active, containerRef }),
      { initialProps: { active: true } },
    );

    rerender({ active: true });

    expect(play).toHaveBeenCalledTimes(1);
  });

  it("does not pause when becoming inactive before the embed has loaded", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const container = document.createElement("div");
    const mediaElement = document.createElement("vimeo-video");
    Object.assign(mediaElement, { play, pause, readyState: 0 });
    container.append(mediaElement);
    const containerRef = createRef<HTMLDivElement>();
    containerRef.current = container;

    const { rerender } = renderHook(
      ({ active }) => useFeaturedReelMedia({ active, containerRef }),
      { initialProps: { active: true } },
    );

    rerender({ active: false });

    expect(pause).not.toHaveBeenCalled();
  });

  it("calls pause when becoming inactive after the embed has loaded", () => {
    jest.useFakeTimers();
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const container = document.createElement("div");
    const mediaElement = document.createElement("vimeo-video");
    Object.assign(mediaElement, { play, pause, readyState: 4 });
    container.append(mediaElement);
    const containerRef = createRef<HTMLDivElement>();
    containerRef.current = container;

    const { rerender } = renderHook(
      ({ active }) => useFeaturedReelMedia({ active, containerRef }),
      { initialProps: { active: true } },
    );

    rerender({ active: false });

    act(() => {
      jest.advanceTimersByTime(200);
    });

    expect(pause).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("calls play from onReady when active and the embed node appears later", async () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const container = document.createElement("div");
    const containerRef = createRef<HTMLDivElement>();
    containerRef.current = container;

    const { result, rerender } = renderHook(
      ({ active }) => useFeaturedReelMedia({ active, containerRef }),
      { initialProps: { active: false } },
    );

    rerender({ active: true });

    act(() => {
      result.current.onReady();
    });

    expect(play).not.toHaveBeenCalled();

    const mediaElement = document.createElement("vimeo-video");
    Object.assign(mediaElement, { play, pause, readyState: 4 });
    container.append(mediaElement);

    await act(async () => {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => resolve());
        });
      });
    });

    expect(play).toHaveBeenCalled();
  });

  it("remounts once on error", () => {
    const containerRef = createRef<HTMLDivElement>();
    containerRef.current = document.createElement("div");

    const { result } = renderHook(() =>
      useFeaturedReelMedia({ active: true, containerRef }),
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

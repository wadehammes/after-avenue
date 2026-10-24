import { describe, expect, it, jest } from "@jest/globals";
import { useFeaturedReelMedia } from "src/components/FeaturedWork/useFeaturedReelMedia";
import { act, renderHook } from "src/tests/test-utils";

describe("useFeaturedReelMedia", () => {
  it("calls play on the media element when active", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const mediaElement = { play, pause };

    renderHook(() => useFeaturedReelMedia({ active: true, mediaElement }));

    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).not.toHaveBeenCalled();
  });

  it("calls pause when inactive", () => {
    const play = jest.fn(async () => {});
    const pause = jest.fn(async () => {});
    const mediaElement = { play, pause };

    renderHook(() => useFeaturedReelMedia({ active: false, mediaElement }));

    expect(pause).toHaveBeenCalledTimes(1);
    expect(play).not.toHaveBeenCalled();
  });

  it("remounts once on error", () => {
    const mediaElement = {
      play: jest.fn(async () => {}),
      pause: jest.fn(async () => {}),
    };

    const { result } = renderHook(() =>
      useFeaturedReelMedia({ active: true, mediaElement }),
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

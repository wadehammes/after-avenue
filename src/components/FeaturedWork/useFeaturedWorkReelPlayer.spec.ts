import { describe, expect, it, jest } from "@jest/globals";
import { act, renderHook } from "src/tests/test-utils";

jest.mock("src/components/FeaturedWork/useFeaturedReelMedia", () => ({
  useFeaturedReelMedia: () => ({
    onError: jest.fn(),
    onReady: jest.fn(),
    remountKey: 0,
  }),
}));

describe("useFeaturedWorkReelPlayer", () => {
  it("returns loading state and player handlers for an active reel", async () => {
    const { useFeaturedWorkReelPlayer } = await import(
      "src/components/FeaturedWork/useFeaturedWorkReelPlayer"
    );

    const { result } = renderHook(() =>
      useFeaturedWorkReelPlayer({
        shouldPlay: true,
        workVideoUrl: "https://vimeo.com/123",
      }),
    );

    expect(result.current.isVideoReady).toBe(false);
    expect(result.current.embedRef.current).toBeNull();
    expect(result.current.playerKey).toBe("https://vimeo.com/123-0");
    expect(result.current.muteHandlers.onReady).toEqual(expect.any(Function));

    act(() => {
      result.current.muteHandlers.onReady?.();
    });

    expect(result.current.isVideoReady).toBe(true);
  });
});

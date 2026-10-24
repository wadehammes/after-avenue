import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  resetIntersectionObserverMocks,
  setupIntersectionObserverMock,
} from "src/tests/mocks/mockIntersectionObserver";
import { act, renderHook, waitFor } from "src/tests/test-utils";

describe("useFeaturedReelInView", () => {
  beforeEach(() => {
    resetIntersectionObserverMocks();
    setupIntersectionObserverMock();
  });

  it("starts with inView true for the priority reel via initialInView before observe runs", async () => {
    const { useFeaturedReelInView } = await import(
      "src/components/FeaturedWork/useFeaturedReelInView"
    );

    const { result } = renderHook(() =>
      useFeaturedReelInView({ priority: true }),
    );

    expect(result.current.inView).toBe(true);
    expect(result.current.hasMountedPlayer).toBe(true);
  });

  it("starts with hasMountedPlayer false for non-priority reels until the target intersects", async () => {
    resetIntersectionObserverMocks();
    setupIntersectionObserverMock({
      fireOnObserve: true,
      isIntersecting: true,
    });

    const { useFeaturedReelInView } = await import(
      "src/components/FeaturedWork/useFeaturedReelInView"
    );

    const { result } = renderHook(() =>
      useFeaturedReelInView({ priority: false }),
    );

    expect(result.current.hasMountedPlayer).toBe(false);

    act(() => {
      result.current.ref(document.createElement("div"));
    });

    await waitFor(() => {
      expect(result.current.hasMountedPlayer).toBe(true);
    });
    expect(result.current.inView).toBe(true);
  });
});

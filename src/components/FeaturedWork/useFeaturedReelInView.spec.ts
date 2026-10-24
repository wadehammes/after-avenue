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

  it("starts with inView true for the priority reel via initialInView", async () => {
    const { useFeaturedReelInView } = await import(
      "src/components/FeaturedWork/useFeaturedReelInView"
    );

    const { result } = renderHook(() =>
      useFeaturedReelInView({ priority: true }),
    );

    expect(result.current.inView).toBe(true);
    expect(result.current.shouldPlay).toBe(true);
  });

  it("starts with shouldPlay false for non-priority reels until the target intersects", async () => {
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

    expect(result.current.shouldPlay).toBe(false);

    act(() => {
      result.current.ref(document.createElement("div"));
    });

    await waitFor(() => {
      expect(result.current.inView).toBe(true);
    });
    expect(result.current.shouldPlay).toBe(true);
  });

  it("keeps shouldPlay true for the priority reel after the observe target is attached", async () => {
    const { useFeaturedReelInView } = await import(
      "src/components/FeaturedWork/useFeaturedReelInView"
    );

    const { result } = renderHook(() =>
      useFeaturedReelInView({ priority: true }),
    );

    expect(result.current.shouldPlay).toBe(true);

    act(() => {
      result.current.ref(document.createElement("div"));
    });

    expect(result.current.shouldPlay).toBe(true);
  });
});

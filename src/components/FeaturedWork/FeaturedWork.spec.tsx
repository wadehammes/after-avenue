import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  FeaturedWorkPageObject,
  featuredWorkPlayerProps,
} from "src/components/FeaturedWork/FeaturedWork.po";
import { act, screen } from "src/tests/test-utils";

describe("FeaturedWork", () => {
  let po: FeaturedWorkPageObject;

  beforeEach(() => {
    po = new FeaturedWorkPageObject();
  });

  it("mounts the priority reel with static autoPlay and without react-player playing", () => {
    po.renderFeaturedWork(undefined, true);

    expect(screen.getByTestId(po.testId)).toBeInTheDocument();
    expect(featuredWorkPlayerProps).toHaveLength(1);
    expect(po.latestPlayerProps()?.playing).toBeUndefined();
    expect(po.latestPlayerProps()?.autoPlay).toBe(true);
    expect(po.latestPlayerProps()?.muted).toBe(true);
    expect(po.latestPlayerProps()?.config).toEqual(
      expect.objectContaining({
        vimeo: expect.objectContaining({ background: true }),
      }),
    );
  });

  it("shows a loading spinner until the embed onReady handler runs", () => {
    po.renderFeaturedWork(undefined, true);

    expect(
      screen.getByRole("status", { name: "Loading video" }),
    ).toBeInTheDocument();

    act(() => {
      po.latestPlayerProps()?.onReady?.();
    });

    expect(
      screen.queryByRole("status", { name: "Loading video" }),
    ).not.toBeInTheDocument();
  });

  it("mounts non-priority reels without autoPlay or playing", () => {
    po.renderFeaturedWork(undefined, false);

    expect(featuredWorkPlayerProps).toHaveLength(1);
    expect(po.latestPlayerProps()?.playing).toBeUndefined();
    expect(po.latestPlayerProps()?.autoPlay).toBeUndefined();
  });
});

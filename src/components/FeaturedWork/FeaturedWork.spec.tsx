import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  FeaturedWorkPageObject,
  featuredWorkPlayerProps,
} from "src/components/FeaturedWork/FeaturedWork.po";

describe("FeaturedWork", () => {
  let po: FeaturedWorkPageObject;

  beforeEach(() => {
    po = new FeaturedWorkPageObject();
  });

  it("does not pass react-player playing or autoPlay; playback is imperative", () => {
    po.renderFeaturedWork(undefined, true);

    expect(featuredWorkPlayerProps).toHaveLength(1);
    expect(po.latestPlayerProps()?.playing).toBeUndefined();
    expect(po.latestPlayerProps()?.autoPlay).toBeUndefined();
    expect(po.latestPlayerProps()?.config).toEqual(
      expect.objectContaining({
        vimeo: expect.objectContaining({ background: true }),
      }),
    );
  });
});

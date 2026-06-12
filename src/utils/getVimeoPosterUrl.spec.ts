import { getVimeoPosterUrl } from "src/utils/getVimeoPosterUrl";

describe("getVimeoPosterUrl", () => {
  it("returns a poster URL for standard Vimeo links", () => {
    expect(getVimeoPosterUrl("https://vimeo.com/1151669721")).toBe(
      "https://vumbnail.com/1151669721.jpg",
    );
    expect(getVimeoPosterUrl("https://vimeo.com/1151669721/721e1ebbcd")).toBe(
      "https://vumbnail.com/1151669721.jpg",
    );
  });

  it("returns undefined for non-Vimeo URLs", () => {
    expect(
      getVimeoPosterUrl("https://youtube.com/watch?v=abc"),
    ).toBeUndefined();
  });
});

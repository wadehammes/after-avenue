jest.mock("next/cache", () => ({
  unstable_cache: jest.fn(),
}));

import { unstable_cache } from "next/cache";
import { cached } from "src/contentful/cache";
import { REVALIDATE_SECONDS } from "src/utils/constants";

const mockUnstableCache = unstable_cache as jest.MockedFunction<
  typeof unstable_cache
>;

describe("cache", () => {
  beforeEach(() => {
    mockUnstableCache.mockClear();
  });

  describe("cached", () => {
    it("calls unstable_cache with key, fn, and default revalidate", async () => {
      const key = ["test", "key"];
      const result = { data: "value" };
      const fn = jest.fn().mockResolvedValue(result);

      mockUnstableCache.mockImplementation((innerFn) => {
        return async () => innerFn();
      });

      const promise = cached({ key, fn });
      const actual = await promise;

      expect(mockUnstableCache).toHaveBeenCalledTimes(1);
      expect(mockUnstableCache).toHaveBeenCalledWith(fn, key, {
        revalidate: REVALIDATE_SECONDS,
      });
      expect(actual).toEqual(result);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("passes custom revalidateSeconds to unstable_cache", async () => {
      const key = ["a"];
      const fn = jest.fn().mockResolvedValue(1);
      mockUnstableCache.mockImplementation((innerFn) => async () => innerFn());

      await cached({ key, fn, revalidateSeconds: 3600 });

      expect(mockUnstableCache).toHaveBeenCalledWith(fn, key, {
        revalidate: 3600,
      });
    });

    it("includes tags in options when provided", async () => {
      const key = ["contentful", "pages"];
      const tags = ["contentful-pages"];
      const fn = jest.fn().mockResolvedValue([]);
      mockUnstableCache.mockImplementation((innerFn) => async () => innerFn());

      await cached({ key, fn, tags });

      expect(mockUnstableCache).toHaveBeenCalledWith(fn, key, {
        revalidate: REVALIDATE_SECONDS,
        tags,
      });
    });

    it("omits tags from options when tags array is empty", async () => {
      const key = ["key"];
      const fn = jest.fn().mockResolvedValue(null);
      mockUnstableCache.mockImplementation((innerFn) => async () => innerFn());

      await cached({ key, fn, tags: [] });

      expect(mockUnstableCache).toHaveBeenCalledWith(fn, key, {
        revalidate: REVALIDATE_SECONDS,
      });
    });

    it("omits tags from options when tags is undefined", async () => {
      const key = ["key"];
      const fn = jest.fn().mockResolvedValue(null);
      mockUnstableCache.mockImplementation((innerFn) => async () => innerFn());

      await cached({ key, fn });

      expect(mockUnstableCache).toHaveBeenCalledWith(fn, key, {
        revalidate: REVALIDATE_SECONDS,
      });
    });

    it("returns the result of the cached function invocation", async () => {
      const key = ["x"];
      const resolved = { id: "1", name: "test" };
      const fn = jest.fn().mockResolvedValue(resolved);
      mockUnstableCache.mockImplementation((innerFn) => async () => innerFn());

      const result = await cached({ key, fn });

      expect(result).toBe(resolved);
    });

    it("propagates errors from the inner function", async () => {
      const key = ["y"];
      const err = new Error("fetch failed");
      const fn = jest.fn().mockRejectedValue(err);
      mockUnstableCache.mockImplementation((innerFn) => async () => innerFn());

      await expect(cached({ key, fn })).rejects.toThrow("fetch failed");
    });
  });
});

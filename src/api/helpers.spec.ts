import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fetchResponse, postJson } from "src/api/helpers";

global.fetch = jest.fn<typeof fetch>();

describe("api helpers", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("fetchResponse", () => {
    it("parses JSON from a fetch response", async () => {
      const response = {
        json: async () => ({ ok: true }),
      } as Response;

      await expect(
        fetchResponse<{ ok: boolean }>(Promise.resolve(response)),
      ).resolves.toEqual({ ok: true });
    });
  });

  describe("postJson", () => {
    it("POSTs JSON and returns the parsed response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "123" }),
      } as Response);

      await expect(
        postJson<{ id: string }>("/api/example", { name: "Ada" }),
      ).resolves.toEqual({ id: "123" });

      expect(mockFetch).toHaveBeenCalledWith("/api/example", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
        },
        body: JSON.stringify({ name: "Ada" }),
      });
    });

    it("throws with the API error message when the response is not ok", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: "Invalid email" }),
      } as Response);

      await expect(postJson("/api/example", {})).rejects.toThrow(
        "Invalid email",
      );
    });

    it("throws a status fallback when the error body is not JSON", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("not json");
        },
      } as unknown as Response);

      await expect(postJson("/api/example", {})).rejects.toThrow(
        "Request failed with status 500",
      );
    });
  });
});

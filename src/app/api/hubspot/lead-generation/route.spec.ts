import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

type PostHandler =
  typeof import("src/app/api/hubspot/lead-generation/route").POST;

let POST: PostHandler;

const mockFetch = jest.fn<typeof fetch>();

describe("POST /api/hubspot/lead-generation", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    jest.isolateModules(() => {
      ({ POST } = require("src/app/api/hubspot/lead-generation/route"));
    });
  });

  beforeEach(() => {
    process.env = { ...originalEnv };
    mockFetch.mockReset();
    globalThis.fetch = mockFetch as typeof fetch;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns 400 when the body fails validation", async () => {
    process.env.ENVIRONMENT = "production";
    process.env.HUBSPOT_API_KEY = "test-key";

    const request = new Request(
      "http://localhost/api/hubspot/lead-generation",
      {
        body: JSON.stringify({ email: "not-an-email", name: "Jane" }),
        method: "POST",
      },
    );

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("skips HubSpot on staging even when the API key is set", async () => {
    process.env.ENVIRONMENT = "staging";
    process.env.HUBSPOT_API_KEY = "test-key";

    const request = new Request(
      "http://localhost/api/hubspot/lead-generation",
      {
        body: JSON.stringify({
          email: "jane@example.com",
          name: "Jane Doe",
        }),
        method: "POST",
      },
    );

    const response = await POST(request);
    const json = (await response.json()) as { message?: string };

    expect(response.status).toBe(200);
    expect(json.message).toContain("skipped");
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("skips HubSpot in local development even when the API key is set", async () => {
    process.env.ENVIRONMENT = "local";
    process.env.HUBSPOT_API_KEY = "test-key";

    const request = new Request(
      "http://localhost/api/hubspot/lead-generation",
      {
        body: JSON.stringify({
          email: "jane@example.com",
          name: "Jane Doe",
        }),
        method: "POST",
      },
    );

    const response = await POST(request);
    const json = (await response.json()) as { message?: string };

    expect(response.status).toBe(200);
    expect(json.message).toContain("skipped");
    expect(mockFetch).not.toHaveBeenCalled();
  });
});

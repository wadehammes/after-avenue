import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

const mockContactsCreate = jest.fn<(...args: unknown[]) => Promise<unknown>>();
const mockEmailsSend =
  jest.fn<
    (...args: unknown[]) => Promise<{ data: { id: string }; error: null }>
  >();

jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    contacts: { create: mockContactsCreate },
    emails: { send: mockEmailsSend },
  })),
}));

jest.mock("src/utils/rateLimit", () => ({
  checkRateLimit: jest.fn(() => false),
}));

jest.mock("src/utils/spamDetection", () => ({
  isSpam: jest.fn(() => ({ isSpam: false, reasons: [] })),
}));

jest.mock("src/emails/renderContactEmails", () => ({
  renderContactFormConfirmationEmail: jest.fn(async () => ({
    html: "<p />",
    text: "text",
  })),
  renderContactFormSubmissionEmail: jest.fn(async () => ({
    html: "<p />",
    text: "text",
  })),
}));

type PostHandler = typeof import("src/app/api/send-email/contact/route").POST;

let POST: PostHandler;

const mockFetch = jest.fn<typeof fetch>();

describe("POST /api/send-email/contact", () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeAll(() => {
    jest.isolateModules(() => {
      ({ POST } = require("src/app/api/send-email/contact/route"));
    });
  });

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      ENVIRONMENT: "production",
      HUBSPOT_PORTAL_ID: "12345",
      RECAPTCHA_SECRET_KEY: "test-secret-key",
      RESEND_API_KEY: "re_test",
      RESEND_GENERAL_AUDIENCE_ID: "audience_1",
    };
    globalThis.fetch = mockFetch as unknown as typeof fetch;
    mockFetch.mockResolvedValue({
      json: async () => ({ hostname: "localhost", success: true }),
      ok: true,
    } as Response);
    mockContactsCreate.mockReset();
    mockContactsCreate.mockResolvedValue({});
    mockEmailsSend.mockReset();
    mockEmailsSend.mockResolvedValue({ data: { id: "email_1" }, error: null });
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    mockFetch.mockReset();
  });

  const postJson = (body: Record<string, unknown>) =>
    POST({
      headers: {
        get: () => null,
      },
      json: async () => body,
    } as unknown as Request);

  it("returns success without sending mail when the honeypot is filled", async () => {
    const response = await postJson({
      email: "bot@example.com",
      name: "Bot",
      recaptchaToken: "token",
      website: "https://spam.example",
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true });
    expect(mockEmailsSend).not.toHaveBeenCalled();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 400 when the body fails schema validation", async () => {
    const response = await postJson({
      email: "jane@example.com",
      name: "Jane",
      phone: "",
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid request",
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("returns 400 when reCAPTCHA verification fails", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({ success: false }),
      ok: true,
    } as Response);

    const response = await postJson({
      email: "jane@example.com",
      name: "Jane Doe",
      phone: "",
      recaptchaToken: "bad-token",
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "reCAPTCHA verification failed",
    });
    expect(mockEmailsSend).not.toHaveBeenCalled();
  });

  it("sends mail when the payload is valid", async () => {
    const response = await postJson({
      briefDescription: "Hello",
      companyName: "Acme",
      email: "jane@example.com",
      marketingConsent: true,
      name: "Jane Doe",
      phone: "555-555-5555",
      recaptchaToken: "good-token",
    });

    expect(response.status).toBe(200);
    expect(mockFetch).toHaveBeenCalled();
    expect(mockContactsCreate).toHaveBeenCalled();
    expect(mockEmailsSend).toHaveBeenCalled();
  });
});

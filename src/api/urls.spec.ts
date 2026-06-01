import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { api } from "src/api/urls";

global.fetch = jest.fn<typeof fetch>();

describe("api", () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("sendEmail.contact", () => {
    it("POSTs contact form data to the contact route", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "email-1" }),
      } as Response);

      await expect(
        api.sendEmail.contact({
          briefDescription: "Need help",
          companyName: "Acme",
          email: "ada@example.com",
          marketingConsent: true,
          name: "Ada Lovelace",
          phone: "555-555-5555",
          recaptchaToken: "token",
        }),
      ).resolves.toEqual({ id: "email-1" });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/send-email/contact",
        expect.objectContaining({
          method: "POST",
        }),
      );

      expect(JSON.parse(String(mockFetch.mock.calls[0]?.[1]?.body))).toEqual({
        briefDescription: "Need help",
        companyName: "Acme",
        email: "ada@example.com",
        marketingConsent: true,
        name: "Ada Lovelace",
        phone: "555-555-5555",
        recaptchaToken: "token",
      });
    });
  });

  describe("hubspot.leadGeneration", () => {
    it("POSTs lead data to the HubSpot route", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Submitted", status: 200 }),
      } as Response);

      await expect(
        api.hubspot.leadGeneration({
          companyName: "Acme",
          email: "ada@example.com",
          name: "Ada Lovelace",
          phone: "555-555-5555",
        }),
      ).resolves.toEqual({ message: "Submitted", status: 200 });

      expect(mockFetch).toHaveBeenCalledWith(
        "/api/hubspot/lead-generation",
        expect.objectContaining({
          method: "POST",
        }),
      );

      expect(JSON.parse(String(mockFetch.mock.calls[0]?.[1]?.body))).toEqual({
        companyName: "Acme",
        email: "ada@example.com",
        name: "Ada Lovelace",
        phone: "555-555-5555",
      });
    });
  });

  describe("deploy.triggerHook", () => {
    it("calls the deploy hook URL", async () => {
      mockFetch.mockResolvedValueOnce({ ok: true } as Response);

      await expect(
        api.deploy.triggerHook("https://example.com/deploy-hook"),
      ).resolves.toBeUndefined();

      expect(mockFetch).toHaveBeenCalledWith("https://example.com/deploy-hook");
    });

    it("throws when the deploy hook responds with an error status", async () => {
      mockFetch.mockResolvedValueOnce({ ok: false, status: 403 } as Response);

      await expect(
        api.deploy.triggerHook("https://example.com/deploy-hook"),
      ).rejects.toThrow("Deploy failed with status 403");
    });
  });
});

import { describe, expect, it } from "@jest/globals";
import {
  contactFormApiSchema,
  contactFormClientSchema,
  createContactFormSchema,
  defaultContactFormMessages,
  hubspotLeadApiSchema,
} from "src/lib/forms/contactForm.schema";

describe("createContactFormSchema", () => {
  const schema = createContactFormSchema(defaultContactFormMessages);

  it("rejects empty required client fields", () => {
    const result = schema.safeParse({
      briefDescription: "",
      companyName: "",
      email: "",
      marketingConsent: true,
      name: "",
      phone: "",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = schema.safeParse({
      briefDescription: "",
      companyName: "",
      email: "not-an-email",
      marketingConsent: true,
      name: "Jane",
      phone: "",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid phone when provided", () => {
    const result = schema.safeParse({
      briefDescription: "",
      companyName: "",
      email: "jane@example.com",
      marketingConsent: true,
      name: "Jane",
      phone: "123",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid client payload with an empty phone", () => {
    const result = schema.safeParse({
      briefDescription: "Hello",
      companyName: "Acme",
      email: "jane@example.com",
      marketingConsent: false,
      name: "Jane",
      phone: "",
      recaptchaToken: "",
      website: "",
    });

    expect(result.success).toBe(true);
  });
});

describe("contactFormClientSchema", () => {
  it("matches the default client schema export", () => {
    const fromFactory = createContactFormSchema(defaultContactFormMessages);
    const payload = {
      briefDescription: "Hello",
      companyName: "Acme",
      email: "jane@example.com",
      marketingConsent: true,
      name: "Jane",
      phone: "",
      website: "",
    };

    expect(contactFormClientSchema.safeParse(payload).success).toBe(
      fromFactory.safeParse({ ...payload, recaptchaToken: "" }).success,
    );
  });
});

describe("contactFormApiSchema", () => {
  it("rejects empty required API fields", () => {
    const result = contactFormApiSchema.safeParse({
      email: "",
      name: "",
      recaptchaToken: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email address", () => {
    const result = contactFormApiSchema.safeParse({
      email: "not-an-email",
      name: "Jane",
      recaptchaToken: "token",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a minimal valid payload", () => {
    const result = contactFormApiSchema.safeParse({
      email: "jane@example.com",
      name: "Jane",
      phone: "",
      recaptchaToken: "token",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a payload without recaptchaToken", () => {
    const result = contactFormApiSchema.safeParse({
      email: "jane@example.com",
      name: "Jane",
    });

    expect(result.success).toBe(false);
  });
});

describe("hubspotLeadApiSchema", () => {
  it("rejects an invalid email address", () => {
    const result = hubspotLeadApiSchema.safeParse({
      email: "bad",
      name: "Jane",
    });

    expect(result.success).toBe(false);
  });

  it("accepts lead fields without recaptchaToken", () => {
    const result = hubspotLeadApiSchema.safeParse({
      companyName: "Acme",
      email: "jane@example.com",
      name: "Jane",
      phone: "",
    });

    expect(result.success).toBe(true);
  });
});

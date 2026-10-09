import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { setProcessEnv } from "src/tests/utils/setProcessEnv";
import {
  getContactFormConfirmationTo,
  getContactFormSubmissionTo,
  isNotificationRecipientOverrideActive,
  shouldSkipResendAudienceSync,
} from "src/utils/emailHelpers";

describe("emailHelpers", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.RESEND_DEV_TO_EMAIL;
    delete process.env.RESEND_TEST_RECIPIENTS;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("routes local notifications to RESEND_DEV_TO_EMAIL", () => {
    process.env.ENVIRONMENT = "local";
    process.env.RESEND_DEV_TO_EMAIL = "dev@example.com";

    expect(getContactFormSubmissionTo()).toBe("dev@example.com");
    expect(isNotificationRecipientOverrideActive()).toBe(true);
    expect(shouldSkipResendAudienceSync()).toBe(true);
  });

  it("routes next dev mail to RESEND_DEV_TO_EMAIL when ENVIRONMENT is still staging", () => {
    process.env.ENVIRONMENT = "staging";
    setProcessEnv({ NODE_ENV: "development" });
    process.env.RESEND_DEV_TO_EMAIL = "dev@example.com";

    expect(getContactFormSubmissionTo()).toBe("dev@example.com");
    expect(
      getContactFormConfirmationTo({
        email: "jane@example.com",
        name: "Jane Doe",
      }),
    ).toBe("dev@example.com");
  });

  it("does not send confirmation to the submitter during local dev without RESEND_DEV_TO_EMAIL", () => {
    process.env.ENVIRONMENT = "local";
    delete process.env.RESEND_DEV_TO_EMAIL;

    expect(
      getContactFormConfirmationTo({
        email: "jane@example.com",
        name: "Jane Doe",
      }),
    ).toBeNull();
  });

  it("routes staging notifications to RESEND_TEST_RECIPIENTS", () => {
    process.env.ENVIRONMENT = "staging";
    process.env.RESEND_TEST_RECIPIENTS =
      " qa@example.com , preview@example.com ";

    expect(getContactFormSubmissionTo()).toEqual([
      "qa@example.com",
      "preview@example.com",
    ]);
    expect(
      getContactFormConfirmationTo({
        email: "jane@example.com",
        name: "Jane Doe",
      }),
    ).toBe("qa@example.com");
    expect(shouldSkipResendAudienceSync()).toBe(true);
  });

  it("does not send mail to production or submitters on staging without override env", () => {
    process.env.ENVIRONMENT = "staging";

    expect(getContactFormSubmissionTo()).toBeNull();
    expect(
      getContactFormConfirmationTo({
        email: "jane@example.com",
        name: "Jane Doe",
      }),
    ).toBeNull();
    expect(shouldSkipResendAudienceSync()).toBe(true);
  });

  it("keeps production recipients when overrides are unset", () => {
    process.env.ENVIRONMENT = "production";

    expect(getContactFormSubmissionTo()).toBe(
      "After Avenue <hello@afteravenue.com>",
    );
    expect(
      getContactFormConfirmationTo({
        email: "jane@example.com",
        name: "Jane Doe",
      }),
    ).toBe("Jane Doe <jane@example.com>");
    expect(shouldSkipResendAudienceSync()).toBe(false);
  });

  it("redirects confirmation mail when local override is active", () => {
    process.env.ENVIRONMENT = "local";
    process.env.RESEND_DEV_TO_EMAIL = "dev@example.com";

    expect(
      getContactFormConfirmationTo({
        email: "jane@example.com",
        name: "Jane Doe",
      }),
    ).toBe("dev@example.com");
  });
});

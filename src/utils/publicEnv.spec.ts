import { afterEach, beforeEach, describe, expect, it } from "@jest/globals";
import { getRecaptchaSiteKey } from "src/utils/publicEnv";

describe("getRecaptchaSiteKey", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    delete process.env.RECAPTCHA_SITE_KEY;
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("prefers NEXT_PUBLIC_RECAPTCHA_SITE_KEY", () => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "public-key";
    process.env.RECAPTCHA_SITE_KEY = "server-key";

    expect(getRecaptchaSiteKey()).toBe("public-key");
  });

  it("falls back to RECAPTCHA_SITE_KEY", () => {
    process.env.RECAPTCHA_SITE_KEY = "server-key";

    expect(getRecaptchaSiteKey()).toBe("server-key");
  });

  it("returns an empty string when unset", () => {
    expect(getRecaptchaSiteKey()).toBe("");
  });
});

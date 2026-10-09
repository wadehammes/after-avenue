export const getRecaptchaSiteKey = (): string =>
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ??
  process.env.RECAPTCHA_SITE_KEY ??
  "";

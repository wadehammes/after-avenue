import { fetchResponse } from "src/api/helpers";

interface RecaptchaVerifyResponse {
  hostname?: string;
  score?: number;
  success: boolean;
}

const DEFAULT_ALLOWED_HOSTNAMES = [
  "afteravenue.com",
  "localhost",
  "staging.afteravenue.com",
  "www.afteravenue.com",
];

let cachedAllowedHostnames: string[] | undefined;

const getAllowedHostnames = (): string[] => {
  if (cachedAllowedHostnames) {
    return cachedAllowedHostnames;
  }

  const fromEnv = process.env.RECAPTCHA_ALLOWED_HOSTNAMES;

  if (!fromEnv) {
    cachedAllowedHostnames = DEFAULT_ALLOWED_HOSTNAMES;
    return cachedAllowedHostnames;
  }

  cachedAllowedHostnames = fromEnv
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

  return cachedAllowedHostnames;
};

const isAllowedHostname = (hostname: string | undefined): boolean => {
  if (!hostname) {
    return true;
  }

  const normalizedHostname = hostname.toLowerCase();

  if (getAllowedHostnames().includes(normalizedHostname)) {
    return true;
  }

  if (normalizedHostname.endsWith(".vercel.app")) {
    return true;
  }

  return false;
};

export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not configured");
    return false;
  }

  if (!token) {
    return false;
  }

  try {
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const data = await fetchResponse<RecaptchaVerifyResponse>(
      fetch("https://www.google.com/recaptcha/api/siteverify", {
        body: params.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }),
    );

    if (!data.success) {
      return false;
    }

    if (!isAllowedHostname(data.hostname)) {
      console.warn("reCAPTCHA hostname not allowed:", data.hostname);
      return false;
    }

    return (data.score ?? 0.5) >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

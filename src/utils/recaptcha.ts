/**
 * Verify reCAPTCHA token with Google's API
 */
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
    // Google's reCAPTCHA API requires form-encoded data, not JSON
    // URLSearchParams creates: "secret=xxx&response=yyy" format
    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      },
    );

    const data = await response.json();

    // Check if verification was successful and score is acceptable (for v3)
    // For v2, success: true is sufficient
    return data.success === true && (data.score ?? 0.5) >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

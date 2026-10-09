import { Resend } from "resend";
import {
  renderContactFormConfirmationEmail,
  renderContactFormSubmissionEmail,
} from "src/emails/renderContactEmails";
import {
  type ContactFormApiBody,
  contactFormApiSchema,
} from "src/lib/forms/contactForm.schema";
import {
  getContactFormConfirmationTo,
  getContactFormSubmissionTo,
  shouldSkipResendAudienceSync,
} from "src/utils/emailHelpers";
import { isNonNullable } from "src/utils/helpers";
import { checkRateLimit } from "src/utils/rateLimit";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  if (body.website) {
    return Response.json({ success: true }, { status: 200 });
  }

  const parsed = contactFormApiSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const res: ContactFormApiBody = parsed.data;

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  if (!resendApiKey) {
    return Response.json(
      { error: "Email delivery is not configured" },
      { status: 503 },
    );
  }

  const resend = new Resend(resendApiKey);

  const isRecaptchaValid = await verifyRecaptchaToken(res.recaptchaToken);
  if (!isRecaptchaValid) {
    return Response.json(
      { error: "reCAPTCHA verification failed" },
      { status: 400 },
    );
  }

  const email = res.email;
  const name = res.name;
  const phone = res.phone || "No phone number provided.";
  const companyName = res.companyName || "No company name provided.";
  const message = res.briefDescription || "No message provided.";
  const marketingConsent = isNonNullable(res.marketingConsent)
    ? res.marketingConsent
    : true;

  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimitKey = `${email}-${clientIp}`;

  if (checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const spamCheck = isSpam({
    email,
    message,
    name,
    companyName,
  });

  if (spamCheck.isSpam) {
    console.warn("Spam detected:", {
      email,
      reasons: spamCheck.reasons,
      ip: clientIp,
    });
    return Response.json({ success: true }, { status: 200 });
  }

  const firstName = name.split(" ")[0] || "";
  const lastName = name.split(" ")[1] || "";

  const emailProps = {
    companyName,
    email,
    hubspotPortalId: process.env.HUBSPOT_PORTAL_ID,
    message,
    name,
    phone,
  };

  try {
    if (!shouldSkipResendAudienceSync()) {
      await resend.contacts.create({
        audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID as string,
        email,
        firstName,
        lastName,
        unsubscribed: !marketingConsent,
      });
    }

    const submissionTo = getContactFormSubmissionTo();
    if (!submissionTo) {
      return Response.json(
        {
          error:
            "Email delivery is not configured for this environment. Set RESEND_DEV_TO_EMAIL or RESEND_TEST_RECIPIENTS.",
        },
        { status: 503 },
      );
    }

    const submissionEmail = await renderContactFormSubmissionEmail(emailProps);

    const data = await resend.emails.send({
      from: "After Avenue Contact Form <forms@afteravenue.com>",
      html: submissionEmail.html,
      replyTo: `${name} <${email}>`,
      subject: `Contact Form Submission - ${companyName}`,
      text: submissionEmail.text,
      to: submissionTo,
    });

    const confirmationTo = getContactFormConfirmationTo({ email, name });

    const delayConfirmationEmail = confirmationTo
      ? setTimeout(async () => {
          const confirmationEmail =
            await renderContactFormConfirmationEmail(emailProps);

          await resend.emails.send({
            from: "After Avenue <hello@afteravenue.com>",
            html: confirmationEmail.html,
            subject: "We received your contact info.",
            text: confirmationEmail.text,
            to: confirmationTo,
          });
        }, 500)
      : undefined;

    if (data.error) {
      if (delayConfirmationEmail) {
        clearTimeout(delayConfirmationEmail);
      }

      return Response.json({ error: data.error });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error sending contact email:", error);
    return Response.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 },
    );
  }
}

import { Resend } from "resend";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";
import { isNonNullable } from "src/utils/helpers";
import { checkRateLimit } from "src/utils/rateLimit";
import { verifyRecaptchaToken } from "src/utils/recaptcha";
import { isSpam } from "src/utils/spamDetection";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res = (await request.json()) as ContactFormInputs & {
    recaptchaToken?: string;
    website?: string;
  };

  // Honeypot check - if website field is filled, it's a bot
  if (res.website) {
    // Silently reject - don't let bots know they were caught
    return Response.json({ success: true }, { status: 200 });
  }

  // Verify reCAPTCHA token
  if (!res.recaptchaToken) {
    return Response.json(
      { error: "reCAPTCHA verification required" },
      { status: 400 },
    );
  }

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

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  // Rate limiting - limit by email and IP
  const clientIp =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const rateLimitKey = `${email}-${clientIp}`;

  if (checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
    // 5 requests per 15 minutes
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  // Spam detection
  const spamCheck = isSpam({
    email,
    message,
    name,
    companyName,
  });

  if (spamCheck.isSpam) {
    // Log spam attempts for monitoring
    console.warn("Spam detected:", {
      email,
      reasons: spamCheck.reasons,
      ip: clientIp,
    });
    // Silently reject spam - don't let spammers know they were caught
    return Response.json({ success: true }, { status: 200 });
  }

  const firstName = name.split(" ")[0] || "";
  const lastName = name.split(" ")[1] || "";

  try {
    await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: !marketingConsent,
      audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID as string,
    });

    const data = await resend.emails.send({
      from: "After Avenue Contact Form <forms@afteravenue.com>",
      replyTo: `${name} <${email}>`,
      to: "After Avenue <hello@afteravenue.com>",
      subject: `Contact Form Submission - ${companyName}`,
      text: `You have a new message from ${name} at ${companyName}. ${message} Their contact info is: ${email} ${phone}. They have been added to Hubspot and Resend if they are a new contact lead.`,
      html: `<div>You have a new message from ${name} at ${companyName}!<br /><br />Message:<br />${message}<br /><br />Their contact info is:<br />${name}<br />${email}<br />${phone}<br /><br />They have been added to Hubspot and Resend if they are a new contact lead.<br /><br />View this lead in Hubspot: https://app.hubspot.com/contacts/${process.env.HUBSPOT_PORTAL_ID}/lists/2/filters?query=${email}</div>`,
    });

    const delayConfirmationEmail = setTimeout(async () => {
      await resend.emails.send({
        to: `${name} <${email}>`,
        from: "After Avenue <hello@afteravenue.com>",
        subject: "We received your contact info.",
        text: `Hi, ${name}! We've received your contact for ${companyName} and will respond to you shortly. Feel free to reply back to this email. Thanks, After Avenue - hello@afteravenue.com | https://afteravenue.com`,
        html: `<div>Hi, ${name}!<br /><br />We've received your contact for ${companyName} and will respond to you shortly. Feel free to reply back to this email.<br /><br />Thanks, After Avenue<br />hello@afteravenue.com<br />https://www.afteravenue.com</div>`,
      });
    }, 500);

    if (data.error) {
      clearTimeout(delayConfirmationEmail);

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

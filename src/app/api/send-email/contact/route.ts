import { Resend } from "resend";
import { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const res: ContactFormInputs = await request.json();
  const email = res.email;
  const name = res.name;
  const phone = res.phone;
  const companyName = res.companyName;
  const message = res.briefDescription;

  const firstName = name.split(" ")[0] || "";
  const lastName = name.split(" ")[1] || "";

  if (!email) {
    return new Response("no to: email provided", {
      status: 404,
    });
  }

  try {
    const data = await resend.emails.send({
      from: `${name} <${email}>`,
      to: "After Avenue <hello@afteravenue.com>",
      subject: `Contact Form Submission - ${companyName}`,
      text: `You have a new message from ${name} at ${companyName}. ${message} Their contact info is: ${email} ${phone}.`,
      html: `<div>You have a new message from ${name} at ${companyName}!<br /><br />Message:<br />${message}<br /><br />Their contact info is:<br />${name}<br />${email}<br />${phone}</div>`,
    });

    await resend.emails.send({
      to: `${name} <${email}>`,
      from: "After Avenue <hello@afteravenue.com>",
      subject: `We received your contact info.`,
      text: `Hi, ${name} 👋🏻! We've received your contact for ${companyName} and will respond to you shortly. Feel free to reply back to this email. Thanks, After Avenue Team - hello@afteravenue.com | https://afteravenue.com`,
      html: `<div>Hi, ${name} 👋🏻!<br /><br />We've received your contact for ${companyName} and will respond to you shortly. Feel free to reply back to this email.<br /><br />Thanks, After Avenue Team<br />hello@afteravenue.com<br />https://afteravenue.com</div>`,
    });

    await resend.contacts.create({
      email,
      firstName,
      lastName,
      unsubscribed: false,
      audienceId: process.env.RESEND_GENERAL_AUDIENCE_ID as string,
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error });
  }
}

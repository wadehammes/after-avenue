import { Text } from "react-email";
import type { ContactFormEmailProps } from "src/emails/ContactFormEmail.interfaces";
import { EmailLayout } from "src/emails/EmailLayout";
import {
  emailGreeting,
  emailParagraph,
  emailSignoff,
} from "src/emails/emailStyles";
import { contactFormEmailPreviewProps } from "src/emails/previewProps";

export const ContactFormConfirmationEmail = (props: ContactFormEmailProps) => {
  const { companyName, name } = props;

  return (
    <EmailLayout preview={`We received your message, ${name}.`}>
      <Text style={emailGreeting}>Hi, {name} —</Text>
      <Text style={emailParagraph}>
        We&apos;ve received your contact for {companyName} and will respond to
        you shortly. Feel free to reply to this email if you have anything else
        to add.
      </Text>
      <Text style={emailSignoff}>After Avenue Team</Text>
    </EmailLayout>
  );
};

ContactFormConfirmationEmail.PreviewProps = contactFormEmailPreviewProps;

export default ContactFormConfirmationEmail;

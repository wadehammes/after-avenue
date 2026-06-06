import { Hr, Link, Text } from "react-email";
import type { ContactFormEmailProps } from "src/emails/ContactFormEmail.interfaces";
import { EmailLayout } from "src/emails/EmailLayout";
import {
  emailColors,
  emailDivider,
  emailFieldLabel,
  emailFieldValue,
  emailGreeting,
  emailLink,
  emailParagraph,
  emailQuote,
} from "src/emails/emailStyles";
import { contactFormEmailPreviewProps } from "src/emails/previewProps";

export const ContactFormSubmissionEmail = (props: ContactFormEmailProps) => {
  const { companyName, email, hubspotPortalId, message, name, phone } = props;

  const hubspotUrl = hubspotPortalId
    ? `https://app.hubspot.com/contacts/${hubspotPortalId}/lists/2/filters?query=${encodeURIComponent(email)}`
    : null;

  return (
    <EmailLayout
      preview={`New contact form submission from ${name} at ${companyName}`}
    >
      <Text style={emailGreeting}>New message from {name}</Text>

      <Text style={emailFieldLabel}>Company</Text>
      <Text style={emailFieldValue}>{companyName}</Text>
      <Hr style={emailDivider} />

      <Text style={emailFieldLabel}>Message</Text>
      <Text style={emailQuote}>{message}</Text>

      <Text style={emailFieldLabel}>Contact</Text>
      <Text style={{ ...emailFieldValue, margin: "0 0 24px" }}>
        {name}
        <br />
        <Link href={`mailto:${email}`} style={emailLink}>
          {email}
        </Link>
        <br />
        {phone}
      </Text>

      <Text
        style={{
          ...emailParagraph,
          color: emailColors.muted,
          fontSize: "13px",
          margin: "0",
        }}
      >
        Added to HubSpot and Resend when applicable.
        {hubspotUrl ? (
          <>
            {" "}
            <Link href={hubspotUrl} style={emailLink}>
              View in HubSpot
            </Link>
          </>
        ) : null}
      </Text>
    </EmailLayout>
  );
};

ContactFormSubmissionEmail.PreviewProps = contactFormEmailPreviewProps;

export default ContactFormSubmissionEmail;

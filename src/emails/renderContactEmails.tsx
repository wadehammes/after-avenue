import { createElement } from "react";
import { render } from "react-email";
import { ContactFormConfirmationEmail } from "src/emails/ContactFormConfirmationEmail";
import type { ContactFormEmailProps } from "src/emails/ContactFormEmail.interfaces";
import { ContactFormSubmissionEmail } from "src/emails/ContactFormSubmissionEmail";

export const renderContactFormSubmissionEmail = async (
  props: ContactFormEmailProps,
) => {
  const element = createElement(ContactFormSubmissionEmail, props);

  return {
    html: await render(element),
    text: await render(element, { plainText: true }),
  };
};

export const renderContactFormConfirmationEmail = async (
  props: ContactFormEmailProps,
) => {
  const element = createElement(ContactFormConfirmationEmail, props);

  return {
    html: await render(element),
    text: await render(element, { plainText: true }),
  };
};

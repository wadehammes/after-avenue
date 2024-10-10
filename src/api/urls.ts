import { FetchMethods, fetchOptions } from "src/api/helpers";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

export const api = {
  sendEmail: {
    contact: ({
      companyName,
      email,
      name,
      phone,
      briefDescription,
      marketingConsent,
    }: ContactFormInputs) =>
      fetch(
        "/api/send-email/contact",
        fetchOptions({
          method: FetchMethods.Post,
          body: JSON.stringify({
            companyName,
            email,
            name,
            phone,
            briefDescription,
            marketingConsent,
          }),
        }),
      ),
  },
  hubspot: {
    leadGeneration: ({
      companyName,
      email,
      name,
      phone,
    }: Partial<ContactFormInputs>) =>
      fetch(
        "/api/hubspot/lead-generation",
        fetchOptions({
          method: FetchMethods.Post,
          body: JSON.stringify({ companyName, email, name, phone }),
        }),
      ),
  },
};

import { FetchMethods, fetchOptions } from "src/api/helpers";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

export const api = {
  sendEmail: {
    contact: async ({
      companyName,
      email,
      name,
      phone,
      briefDescription,
      marketingConsent,
      recaptchaToken,
    }: ContactFormInputs & { recaptchaToken?: string }) => {
      const response = await fetch(
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
            recaptchaToken,
          }),
        }),
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return response.json();
    },
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

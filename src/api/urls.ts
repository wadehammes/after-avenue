import { FetchMethods, fetchOptions, fetchResponse } from "src/api/helpers";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";
import type { VercelDeploymentsResponse } from "src/interfaces/vercel.interfaces";

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
  vercel: () =>
    fetchResponse<VercelDeploymentsResponse>(
      fetch("/api/vercel", fetchOptions({ method: FetchMethods.Post })),
    ),
};

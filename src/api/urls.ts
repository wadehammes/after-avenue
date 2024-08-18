import { FetchMethods, fetchOptions, fetchResponse } from "src/api/helpers";
import { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

export const api = {
  sendEmail: {
    contact: ({
      companyName,
      email,
      name,
    }: Pick<ContactFormInputs, "email" | "name" | "companyName">) =>
      fetch(
        "/api/send-email/contact",
        fetchOptions({
          method: FetchMethods.Post,
          body: JSON.stringify({ email, name, companyName }),
        }),
      ),
    welcome: ({ email }: { email: string }) =>
      fetchResponse<{ data: { id: string } }>(
        fetch(
          "/api/send-email/welcome",
          fetchOptions({
            method: FetchMethods.Post,
            body: JSON.stringify({ email }),
          }),
        ),
      ),
  },
};

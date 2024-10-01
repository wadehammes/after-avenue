import { FetchMethods, fetchOptions } from "src/api/helpers";
import { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

export const api = {
  sendEmail: {
    contact: ({
      companyName,
      email,
      name,
      phone,
      briefDescription,
    }: Pick<
      ContactFormInputs,
      "email" | "name" | "companyName" | "phone" | "briefDescription"
    >) =>
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
          }),
        }),
      ),
  },
};

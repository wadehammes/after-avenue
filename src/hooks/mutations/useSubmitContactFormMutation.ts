import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

export type SubmitContactFormParams = ContactFormInputs & {
  recaptchaToken: string;
};

export const useSubmitContactFormMutation = () => {
  return useMutation({
    mutationFn: async ({
      recaptchaToken,
      ...contactFields
    }: SubmitContactFormParams) => {
      await api.sendEmail.contact({ ...contactFields, recaptchaToken });
      return api.hubspot.leadGeneration(contactFields);
    },
  });
};

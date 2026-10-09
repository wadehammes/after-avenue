import { useMutation } from "@tanstack/react-query";
import { api } from "src/api/urls";
import type { ContactFormValues } from "src/lib/forms/contactForm.schema";
import { isNonProductionContactEnvironment } from "src/utils/helpers";

export type SubmitContactFormParams = ContactFormValues & {
  recaptchaToken: string;
};

export const useSubmitContactFormMutation = () => {
  return useMutation({
    mutationFn: async ({
      recaptchaToken,
      ...contactFields
    }: SubmitContactFormParams) => {
      await api.sendEmail.contact({ ...contactFields, recaptchaToken });

      if (isNonProductionContactEnvironment()) {
        return {
          message: "HubSpot skipped outside production",
          status: 200,
        };
      }

      return api.hubspot.leadGeneration(contactFields);
    },
  });
};

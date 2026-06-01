import { postJson } from "src/api/helpers";
import type { ContactFormInputs } from "src/components/ContactForm/ContactForm.component";

type ContactEmailApiResponse = Record<string, unknown> & {
  error?: string | { message?: string };
};

type HubspotLeadGenerationApiResponse = {
  error?: string;
  message?: string;
  status?: number;
};

export const api = {
  sendEmail: {
    contact: ({
      companyName,
      email,
      name,
      phone,
      briefDescription,
      marketingConsent,
      recaptchaToken,
    }: ContactFormInputs & { recaptchaToken?: string }) =>
      postJson<ContactEmailApiResponse>("/api/send-email/contact", {
        companyName,
        email,
        name,
        phone,
        briefDescription,
        marketingConsent,
        recaptchaToken,
      }),
  },
  hubspot: {
    leadGeneration: ({
      companyName,
      email,
      name,
      phone,
    }: Partial<ContactFormInputs>) =>
      postJson<HubspotLeadGenerationApiResponse>(
        "/api/hubspot/lead-generation",
        { companyName, email, name, phone },
      ),
  },
  deploy: {
    triggerHook: async (deployHook: string) => {
      const response = await fetch(deployHook);

      if (!response.ok) {
        throw new Error(`Deploy failed with status ${response.status}`);
      }
    },
  },
};

import {
  contactApiFieldsSchema,
  createContactFieldsSchema,
  formSubmissionMetaSchema,
  type RequiredFieldMessages,
} from "src/lib/forms/formFieldSchemas";
import { z } from "zod";

export type ContactFormMessages = RequiredFieldMessages;

export const defaultContactFormMessages: ContactFormMessages = {
  fieldRequired: "This field is required",
  invalidEmail: "Enter a valid email address",
  invalidPhone: "Enter a valid phone number",
};

export const createContactFormSchema = (messages: ContactFormMessages) =>
  createContactFieldsSchema(messages).extend({
    briefDescription: z.string(),
    companyName: z.string(),
    marketingConsent: z.boolean(),
    recaptchaToken: z.string().optional(),
    website: z.string().optional(),
  });

export const contactFormClientSchema = createContactFormSchema(
  defaultContactFormMessages,
);

export type ContactFormValues = z.infer<typeof contactFormClientSchema>;

export const contactFormApiSchema = contactApiFieldsSchema
  .extend({
    briefDescription: z.string().optional(),
    companyName: z.string().optional(),
    marketingConsent: z.boolean().optional(),
  })
  .merge(formSubmissionMetaSchema);

export type ContactFormApiBody = z.infer<typeof contactFormApiSchema>;

export const hubspotLeadApiSchema = contactApiFieldsSchema.extend({
  companyName: z.string().optional(),
});

export type HubspotLeadApiBody = z.infer<typeof hubspotLeadApiSchema>;

import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";
import { z } from "zod";

export type RequiredFieldMessages = {
  fieldRequired: string;
  invalidEmail: string;
  invalidPhone: string;
};

const contactApiFieldMessages: RequiredFieldMessages = {
  fieldRequired: "Required",
  invalidEmail: "Invalid email",
  invalidPhone: "Invalid phone",
};

const createRequiredEmailSchema = (messages: RequiredFieldMessages) =>
  z
    .string()
    .min(1, messages.fieldRequired)
    .regex(EMAIL_VALIDATION_REGEX, messages.invalidEmail);

const createOptionalPhoneSchema = (
  messages: Pick<RequiredFieldMessages, "invalidPhone">,
) =>
  z
    .string()
    .refine(
      (value) => value === "" || PHONE_NUMBER_VALIDATION_REGEX.test(value),
      messages.invalidPhone,
    );

export const formSubmissionMetaSchema = z.object({
  recaptchaToken: z.string().min(1),
  website: z.string().optional(),
});

export const createContactFieldsSchema = (messages: RequiredFieldMessages) =>
  z.object({
    email: createRequiredEmailSchema(messages),
    name: z.string().min(1, messages.fieldRequired),
    phone: createOptionalPhoneSchema(messages),
  });

export const contactApiFieldsSchema = createContactFieldsSchema(
  contactApiFieldMessages,
);

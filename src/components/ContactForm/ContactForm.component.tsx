"use client";

import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import styles from "src/components/ContactForm/ContactForm.module.css";
import { StyledButton } from "src/components/StyledButton/StyledButton.component";
import { StyledInput } from "src/components/StyledInput/StyledInput.component";
import { StyledTextArea } from "src/components/StyledInput/StyledTextArea.component";
import { useSendContactEmailApiMutation } from "src/hooks/mutations/useSendContactEmailApi.mutation";
import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";

export interface ContactFormInputs {
  briefDescription: string;
  companyName: string;
  email: string;
  name: string;
  phone: string;
}

const defaultValues: ContactFormInputs = {
  briefDescription: "",
  companyName: "",
  email: "",
  name: "",
  phone: "",
};

export const ContactForm = () => {
  const reCaptcha = useRef<ReCAPTCHA>(null);
  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { isSubmitting, errors, isSubmitSuccessful },
  } = useForm({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const useSendContactEmailApi = useSendContactEmailApiMutation();

  const submitToNotion: SubmitHandler<ContactFormInputs> = async (data) => {
    clearErrors("email");

    if (reCaptcha && reCaptcha.current) {
      const captcha = await reCaptcha.current.executeAsync();

      if (captcha) {
        const { companyName, email, name, phone, briefDescription } = data;

        const emailToLowerCase = email.toLowerCase();

        try {
          await useSendContactEmailApi.mutateAsync({
            companyName,
            email: emailToLowerCase,
            name,
            phone,
            briefDescription,
          });
        } catch (_e) {
          throw new Error("Failed to submit contact. Please try again.");
        }
      }
    }
  };

  const hasMissingFields = errors.phone || errors.companyName;

  if (isSubmitSuccessful) {
    return (
      <div className={styles.formSubmitSuccess}>
        <p>
          We can't wait to talk to you about your project. Check your inbox in
          the next 24-48 hours for a message back from us.
        </p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(submitToNotion)}>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            largeInput
            placeholder="Your name"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.name}
            label="Your full name *"
            id="name"
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{ required: true, pattern: EMAIL_VALIDATION_REGEX }}
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            largeInput
            placeholder="your@email.com"
            ref={ref}
            name={name}
            onChange={(e) => {
              clearErrors("email");
              onChange(e);
            }}
            value={value}
            hasError={errors.email}
            label="Your email *"
            id="email"
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        rules={{ pattern: PHONE_NUMBER_VALIDATION_REGEX }}
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            largeInput
            placeholder="555-555-5555"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.phone}
            label="Your phone number"
            id="phone"
          />
        )}
      />
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            largeInput
            placeholder="Your company's name"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.companyName}
            label="Your company name"
            id="companyName"
          />
        )}
      />
      <Controller
        control={control}
        name="briefDescription"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledTextArea
            largeInput
            placeholder="Your message"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.briefDescription}
            label="What can we help you with?"
            id="briefDescription"
          />
        )}
      />
      <div className={styles.formSubmitContainer}>
        <div>
          {hasMissingFields ? (
            <p>You are missing some required fields!</p>
          ) : null}
        </div>
        <div>
          <StyledButton type="submit" isDisabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </StyledButton>
        </div>
      </div>
      <ReCAPTCHA
        ref={reCaptcha}
        size="invisible" // v3
        sitekey={process.env.RECAPTCHA_SITE_KEY as string}
      />
      <input type="submit" hidden />
    </form>
  );
};

"use client";

import dynamic from "next/dynamic";
import { useId, useRef } from "react";
import type ReCAPTCHAComponent from "react-google-recaptcha";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), {
  ssr: false,
}) as typeof ReCAPTCHAComponent;

import styles from "src/components/ContactForm/ContactForm.module.css";
import { StyledButton } from "src/components/StyledButton/StyledButton.component";
import { StyledInput } from "src/components/StyledInput/StyledInput.component";
import { StyledTextArea } from "src/components/StyledInput/StyledTextArea.component";
import { useGlobalVariables } from "src/context/globalContext.context";
import { useHubspotLeadGenerationFormApiMutation } from "src/hooks/mutations/useHubspotLeadGenerationFormApi.mutation";
import { useSendContactEmailApiMutation } from "src/hooks/mutations/useSendContactEmailApi.mutation";
import {
  EMAIL_VALIDATION_REGEX,
  PHONE_NUMBER_VALIDATION_REGEX,
} from "src/utils/regex";

export interface ContactFormInputs {
  briefDescription: string;
  companyName: string;
  email: string;
  marketingConsent: boolean;
  name: string;
  phone: string;
  website?: string; // Honeypot field - should always be empty
}

const defaultValues: ContactFormInputs = {
  briefDescription: "",
  companyName: "",
  email: "",
  marketingConsent: true,
  name: "",
  phone: "",
  website: "",
};

export const ContactForm = () => {
  const globalVariables = useGlobalVariables();
  const reCaptcha = useRef<ReCAPTCHAComponent>(null);
  const {
    handleSubmit,
    control,
    clearErrors,
    setError,
    formState: { isSubmitting, errors, isSubmitSuccessful },
    register,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const companyNameId = useId();
  const briefDescriptionId = useId();
  const marketingConsentId = useId();
  const websiteId = useId();

  const useSendContactEmailApi = useSendContactEmailApiMutation();
  const useHubspotLeadGenerationFormApi =
    useHubspotLeadGenerationFormApiMutation();

  const onSubmitForm: SubmitHandler<ContactFormInputs> = async (data) => {
    clearErrors("email");

    // Honeypot check - if website field is filled, it's a bot
    if (data.website) {
      // Silently fail - don't let bots know they were caught
      return;
    }

    if (reCaptcha?.current) {
      const captcha = await reCaptcha.current.executeAsync();

      if (!captcha) {
        throw new Error("reCAPTCHA verification failed. Please try again.");
      }

      const {
        briefDescription,
        companyName,
        email,
        marketingConsent,
        name,
        phone,
      } = data;

      const emailToLowerCase = email.toLowerCase();

      try {
        await useSendContactEmailApi.mutateAsync({
          briefDescription,
          companyName,
          email: emailToLowerCase,
          marketingConsent,
          name,
          phone,
          recaptchaToken: captcha,
        });

        await useHubspotLeadGenerationFormApi.mutateAsync({
          companyName,
          email: emailToLowerCase,
          name,
          phone,
        });
      } catch (error) {
        // Reset reCAPTCHA on error
        reCaptcha.current?.reset();

        // Extract error message from API response
        let errorMessage = "Failed to submit contact. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (
          typeof error === "object" &&
          error !== null &&
          "message" in error
        ) {
          errorMessage = String(error.message);
        }

        // Set form error so user can see it
        setError("root", {
          type: "manual",
          message: errorMessage,
        });

        // Re-throw to stop form submission
        throw error;
      }
    } else {
      throw new Error("reCAPTCHA not loaded. Please refresh the page.");
    }
  };

  const hasMissingFields = errors.phone || errors.companyName;

  if (isSubmitSuccessful) {
    return (
      <div className={styles.formSubmitSuccess}>
        <p>{globalVariables.contactFormSuccessMessage}</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        control={control}
        name="name"
        rules={{ required: true }}
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            placeholder="Your name"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.name}
            label="Your full name *"
            id={nameId}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{ required: true, pattern: EMAIL_VALIDATION_REGEX }}
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
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
            id={emailId}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        rules={{ pattern: PHONE_NUMBER_VALIDATION_REGEX }}
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            placeholder="555-555-5555"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.phone}
            label="Your phone number"
            id={phoneId}
          />
        )}
      />
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledInput
            placeholder="Your company's name"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.companyName}
            label="Your company name"
            id={companyNameId}
          />
        )}
      />
      <Controller
        control={control}
        name="briefDescription"
        render={({ field: { onChange, value, name, ref } }) => (
          <StyledTextArea
            placeholder="Your message"
            ref={ref}
            name={name}
            onChange={onChange}
            value={value}
            hasError={errors.briefDescription}
            label="What can we help you with?"
            id={briefDescriptionId}
          />
        )}
      />
      {globalVariables.contactFormMarketingConsentText ? (
        <div className={styles.marketingConsentContainer}>
          <label htmlFor="marketingConsent" className={styles.marketingConsent}>
            <input
              {...register("marketingConsent")}
              type="checkbox"
              id={marketingConsentId}
            />
            {globalVariables.contactFormMarketingConsentText}
          </label>
        </div>
      ) : null}
      {/* Honeypot field - hidden from users but visible to bots */}
      <div className={styles.honeypot}>
        <label htmlFor={websiteId}>
          <input
            {...register("website")}
            type="text"
            id={websiteId}
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />
        </label>
      </div>
      <div className={styles.formSubmitContainer}>
        <div>
          {hasMissingFields ? (
            <p>You are missing some required fields!</p>
          ) : null}
          {errors.root ? (
            <p className={styles.errorMessage}>{errors.root.message}</p>
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

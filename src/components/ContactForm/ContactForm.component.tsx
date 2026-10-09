"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import type ReCAPTCHAComponent from "react-google-recaptcha";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Checkbox } from "src/components/Checkbox/Checkbox.component";
import styles from "src/components/ContactForm/ContactForm.module.css";
import { ContactFormReCaptcha } from "src/components/ContactForm/ContactFormReCaptcha.component";
import { FormWebsiteHoneypot } from "src/components/forms/FormWebsiteHoneypot.component";
import { Input } from "src/components/Input/Input.component";
import { StyledButton } from "src/components/StyledButton/StyledButton.component";
import { TextArea } from "src/components/TextArea/TextArea.component";
import { useGlobalVariables } from "src/context/globalContext.context";
import { useSubmitContactFormMutation } from "src/hooks/mutations/useSubmitContactFormMutation";
import {
  type ContactFormValues,
  contactFormClientSchema,
} from "src/lib/forms/contactForm.schema";
import { appToast } from "src/lib/toast/appToast";
import layoutStyles from "src/styles/formLayoutShared.module.css";
import { getRecaptchaSiteKey } from "src/utils/publicEnv";

const defaultValues: ContactFormValues = {
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
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: zodResolver(contactFormClientSchema),
    reValidateMode: "onBlur",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitContactForm = useSubmitContactFormMutation();
  const isBusy = isSubmitting || submitContactForm.isPending;

  const onSubmitForm: SubmitHandler<ContactFormValues> = async (data) => {
    if (data.website) {
      return;
    }

    if (!reCaptcha.current) {
      appToast.error("reCAPTCHA not loaded. Please refresh the page.");
      return;
    }

    const captcha = await reCaptcha.current.executeAsync();
    if (!captcha) {
      appToast.error("reCAPTCHA verification failed. Please try again.");
      return;
    }

    const emailToLowerCase = data.email.toLowerCase();

    try {
      await submitContactForm.mutateAsync({
        briefDescription: data.briefDescription,
        companyName: data.companyName,
        email: emailToLowerCase,
        marketingConsent: data.marketingConsent,
        name: data.name,
        phone: data.phone,
        recaptchaToken: captcha,
      });
      setSubmitted(true);
      reset(defaultValues);
      reCaptcha.current.reset();
    } catch (error) {
      reCaptcha.current.reset();

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to submit contact. Please try again.";

      appToast.error(errorMessage);
    }
  };

  const hasMissingRequiredFields = errors.name || errors.email;

  if (submitted) {
    return (
      <div className={styles.formSubmitSuccess}>
        <p>{globalVariables.contactFormSuccessMessage}</p>
      </div>
    );
  }

  return (
    <form
      className={layoutStyles.form}
      noValidate
      onSubmit={handleSubmit(onSubmitForm)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            hasError={errors.name}
            label="Your full name *"
            name={name}
            onChange={onChange}
            placeholder="Your name"
            ref={ref}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            hasError={errors.email}
            label="Your email *"
            name={name}
            onChange={onChange}
            placeholder="your@email.com"
            ref={ref}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            hasError={errors.phone}
            label="Your phone number"
            name={name}
            onChange={onChange}
            placeholder="555-555-5555"
            ref={ref}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="companyName"
        render={({ field: { onChange, value, name, ref } }) => (
          <Input
            hasError={errors.companyName}
            label="Your company name"
            name={name}
            onChange={onChange}
            placeholder="Your company's name"
            ref={ref}
            value={value}
          />
        )}
      />
      <Controller
        control={control}
        name="briefDescription"
        render={({ field: { onChange, value, name, ref } }) => (
          <TextArea
            hasError={errors.briefDescription}
            label="What can we help you with?"
            name={name}
            onChange={onChange}
            placeholder="Your message"
            ref={ref}
            value={value}
          />
        )}
      />
      {globalVariables.contactFormMarketingConsentText ? (
        <Controller
          control={control}
          name="marketingConsent"
          render={({ field: { onBlur, onChange, value, name, ref } }) => (
            <Checkbox
              checked={value}
              label={globalVariables.contactFormMarketingConsentText}
              name={name}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
            />
          )}
        />
      ) : null}
      <div className={layoutStyles.formSubmitContainer}>
        <div>
          {hasMissingRequiredFields ? (
            <p>You are missing some required fields!</p>
          ) : null}
        </div>
        <div>
          <StyledButton type="submit" isDisabled={isBusy}>
            {isBusy ? "Submitting..." : "Submit"}
          </StyledButton>
        </div>
      </div>
      <FormWebsiteHoneypot
        className={layoutStyles.honeypot}
        control={control}
      />
      <ContactFormReCaptcha
        ref={reCaptcha}
        size="invisible"
        sitekey={getRecaptchaSiteKey()}
      />
    </form>
  );
};

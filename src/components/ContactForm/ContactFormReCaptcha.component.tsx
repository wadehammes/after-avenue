"use client";

import type { Ref } from "react";
import type ReCAPTCHA from "react-google-recaptcha";
import { BrowserLazyDefault } from "src/ui/browserLazyDefault";

const recaptchaModulePromise = import("react-google-recaptcha");

type ContactFormReCaptchaProps = {
  ref?: Ref<ReCAPTCHA>;
  sitekey: string;
  size: "invisible";
};

export const ContactFormReCaptcha = (props: ContactFormReCaptchaProps) => {
  return (
    <BrowserLazyDefault modulePromise={recaptchaModulePromise} {...props} />
  );
};

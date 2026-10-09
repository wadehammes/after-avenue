"use client";

import type { Ref } from "react";
import type ReCAPTCHA from "react-google-recaptcha";
import { createBrowserLazyDefault } from "src/ui/browserLazyDefault";

const ReCaptchaLazy = createBrowserLazyDefault(
  () => import("react-google-recaptcha"),
);

type ContactFormReCaptchaProps = {
  ref?: Ref<ReCAPTCHA>;
  sitekey: string;
  size: "invisible";
};

export const ContactFormReCaptcha = (props: ContactFormReCaptchaProps) => {
  return <ReCaptchaLazy {...props} />;
};

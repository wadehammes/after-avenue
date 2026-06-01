import { forwardRef, useImperativeHandle } from "react";
import type ReCAPTCHA from "react-google-recaptcha";

export const mockRecaptchaToken = "recaptcha-token";

const MockGoogleRecaptcha = forwardRef((_props, ref) => {
  useImperativeHandle(
    ref,
    () =>
      ({
        executeAsync: jest.fn(() => Promise.resolve(mockRecaptchaToken)),
        reset: jest.fn(),
      }) as unknown as ReCAPTCHA,
  );

  return null;
});

MockGoogleRecaptcha.displayName = "MockGoogleRecaptcha";

export default MockGoogleRecaptcha;

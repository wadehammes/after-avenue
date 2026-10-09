import { type Ref, useImperativeHandle } from "react";
import type ReCAPTCHA from "react-google-recaptcha";

export const mockRecaptchaToken = "recaptcha-token";

let attachRecaptchaRef = true;

export const mockRecaptchaHandlers = {
  executeAsync: jest.fn(() => Promise.resolve(mockRecaptchaToken)),
  reset: jest.fn(),
};

export const setAttachRecaptchaRef = (attach: boolean) => {
  attachRecaptchaRef = attach;
};

export const resetMockRecaptcha = () => {
  attachRecaptchaRef = true;
  mockRecaptchaHandlers.executeAsync.mockReset();
  mockRecaptchaHandlers.executeAsync.mockImplementation(() =>
    Promise.resolve(mockRecaptchaToken),
  );
  mockRecaptchaHandlers.reset.mockReset();
};

type MockGoogleRecaptchaProps = {
  ref?: Ref<ReCAPTCHA>;
};

const MockGoogleRecaptcha = ({ ref }: MockGoogleRecaptchaProps) => {
  useImperativeHandle(
    ref,
    () =>
      (attachRecaptchaRef
        ? mockRecaptchaHandlers
        : null) as unknown as ReCAPTCHA,
    [],
  );

  return null;
};

MockGoogleRecaptcha.displayName = "MockGoogleRecaptcha";

export default MockGoogleRecaptcha;

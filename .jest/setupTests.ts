import "@testing-library/jest-dom/jest-globals";
import type ReCAPTCHA from "react-google-recaptcha";
import { setupIntersectionObserverMock } from "src/tests/mocks/mockIntersectionObserver";
import { setupMockMatchMedia } from "src/tests/mocks/mockMatchMedia";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

declare global {
  var grecaptcha: ReCAPTCHA;
}

const mockRecaptcha = {
  executeAsync: () => Promise.resolve("token"),
} as unknown as ReCAPTCHA;

globalThis.grecaptcha = mockRecaptcha;

jest.mock("next/router", () => ({
  useRouter: () => mockedUseRouterReturnValue,
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: require("src/tests/mocks/mockNextDynamic").default,
}));

global.beforeAll(() => {
  setupIntersectionObserverMock();
  setupMockMatchMedia();
});

global.beforeEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

global.afterAll(() => {
  jest.resetAllMocks();
});

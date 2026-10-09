import "@testing-library/jest-dom/jest-globals";
import { TextDecoder, TextEncoder } from "node:util";
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

Object.assign(globalThis, {
  TextDecoder,
  TextEncoder,
});

if (globalThis.PointerEvent === undefined) {
  class MockPointerEvent extends MouseEvent {
    constructor(type: string, props?: MouseEventInit) {
      super(type, props);
    }
  }

  globalThis.PointerEvent = MockPointerEvent as unknown as typeof PointerEvent;
}

if (globalThis.Response === undefined) {
  class MockResponse {
    body: string;
    status: number;

    constructor(body: string, init?: ResponseInit) {
      this.body = body;
      this.status = init?.status ?? 200;
    }

    static json(data: unknown, init?: ResponseInit) {
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: {
          "content-type": "application/json",
          ...(init?.headers as Record<string, string> | undefined),
        },
      });
    }

    async json() {
      return JSON.parse(this.body) as unknown;
    }
  }

  globalThis.Response = MockResponse as unknown as typeof Response;
}

if (globalThis.Request === undefined) {
  class MockRequest {
    headers: Headers;
    private readonly requestBody: string;

    constructor(_input: string, init?: RequestInit) {
      this.requestBody = typeof init?.body === "string" ? init.body : "";
      this.headers = new Headers(init?.headers);
    }

    async json() {
      return JSON.parse(this.requestBody) as unknown;
    }
  }

  globalThis.Request = MockRequest as unknown as typeof Request;
}

jest.mock("next/router", () => ({
  useRouter: () => mockedUseRouterReturnValue,
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: require("src/tests/mocks/mockNextDynamic").default,
}));

jest.mock("react-email", () =>
  require("src/tests/mocks/mockReactEmailJsdom").mockReactEmailModule(),
);

jest.mock("src/ui/browserLazyDefault", () =>
  require("src/tests/mocks/mockBrowserLazyDefault"),
);

jest.mock("src/lib/toast/appToast", () =>
  require("src/tests/mocks/appToast.mock"),
);

global.beforeAll(() => {
  setupIntersectionObserverMock();
  setupMockMatchMedia();
});

global.beforeEach(() => {
  const { appToast } = require("src/tests/mocks/appToast.mock") as {
    appToast: { error: jest.Mock; success: jest.Mock; warning: jest.Mock };
  };
  appToast.error.mockReset();
  appToast.success.mockReset();
  appToast.warning.mockReset();
});

global.beforeEach(() => {
  jest.clearAllTimers();
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

global.afterAll(() => {
  jest.resetAllMocks();
});

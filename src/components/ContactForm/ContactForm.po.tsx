import { api } from "src/api/urls";
import { ContactForm } from "src/components/ContactForm/ContactForm.component";
import type { GlobalVariables } from "src/contentful/getGlobalVariables";
import { GlobalVariablesProvider } from "src/context/globalContext.context";
import {
  BasePageObject,
  type BasePageObjectProps,
} from "src/tests/basePageObject.po";
import { mockApiResponse } from "src/tests/mocks/mockApiResponse";
import { render } from "src/tests/test-utils";

jest.mock("src/api/urls", () => ({
  api: {
    sendEmail: {
      contact: jest.fn(),
    },
    hubspot: {
      leadGeneration: jest.fn(),
    },
  },
}));

jest.mock("react-google-recaptcha", () =>
  require("src/tests/mocks/mockGoogleRecaptcha"),
);

export const mockApi = jest.mocked(api);

const globalVariables: GlobalVariables = {
  id: "global-variables",
  contactFormSuccessMessage: "Thanks for reaching out.",
};

export class ContactFormPageObject extends BasePageObject {
  public formData = {
    briefDescription: "Need help with a project",
    companyName: "Acme",
    email: "Ada@Example.com",
    name: "Ada Lovelace",
    phone: "555-555-5555",
  };

  constructor(
    { debug, raiseOnFind }: BasePageObjectProps = {
      debug: false,
      raiseOnFind: false,
    },
  ) {
    super({ debug, raiseOnFind });
  }

  renderContactForm() {
    render(
      <GlobalVariablesProvider value={globalVariables}>
        <ContactForm />
      </GlobalVariablesProvider>,
    );
  }

  setupMockSuccess() {
    mockApiResponse(
      true,
      mockApi.sendEmail.contact,
      { id: "email-1" },
      new Error("Email failed"),
    );
    mockApiResponse(
      true,
      mockApi.hubspot.leadGeneration,
      { message: "Submitted", status: 200 },
      new Error("HubSpot failed"),
    );
  }

  setupMockEmailFailure() {
    mockApiResponse(
      false,
      mockApi.sendEmail.contact,
      { id: "email-1" },
      new Error("Email failed"),
    );
  }

  setupMockHubspotFailure() {
    mockApiResponse(
      true,
      mockApi.sendEmail.contact,
      { id: "email-1" },
      new Error("Email failed"),
    );
    mockApiResponse(
      false,
      mockApi.hubspot.leadGeneration,
      { message: "Submitted", status: 200 },
      new Error("HubSpot failed"),
    );
  }
}

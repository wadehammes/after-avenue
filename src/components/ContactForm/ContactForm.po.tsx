import type { UserEvent } from "@testing-library/user-event";
import { api } from "src/api/urls";
import { ContactForm } from "src/components/ContactForm/ContactForm.component";
import type { GlobalVariables } from "src/contentful/getGlobalVariables";
import { GlobalVariablesProvider } from "src/context/globalContext.context";
import {
  BasePageObject,
  type BasePageObjectProps,
} from "src/tests/basePageObject.po";
import { mockApiResponse } from "src/tests/mocks/mockApiResponse";
import { render, screen } from "src/tests/test-utils";

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

jest.mock("react-google-recaptcha", () => ({
  __esModule: true,
  default: require("src/tests/mocks/mockGoogleRecaptcha").default,
}));

export const mockApi = jest.mocked(api);
export { appToast as mockToast } from "src/tests/mocks/appToast.mock";

export const defaultContactFormGlobalVariables: GlobalVariables = {
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

  renderContactForm(
    globalVariables: GlobalVariables = defaultContactFormGlobalVariables,
  ) {
    render(
      <GlobalVariablesProvider value={globalVariables}>
        <ContactForm />
      </GlobalVariablesProvider>,
    );
  }

  async fillContactFormFields(user: UserEvent) {
    await user.type(
      screen.getByLabelText("Your full name *"),
      this.formData.name,
    );
    await user.type(screen.getByLabelText("Your email *"), this.formData.email);
    await user.type(
      screen.getByLabelText("Your phone number"),
      this.formData.phone,
    );
    await user.type(
      screen.getByLabelText("Your company name"),
      this.formData.companyName,
    );
    await user.type(
      screen.getByLabelText("What can we help you with?"),
      this.formData.briefDescription,
    );
  }

  async fillAndSubmitContactForm(user: UserEvent) {
    await this.fillContactFormFields(user);
    await user.click(screen.getByRole("button", { name: "Submit" }));
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

import { beforeEach, describe, expect, it, type jest } from "@jest/globals";
import {
  ContactFormPageObject,
  defaultContactFormGlobalVariables,
  mockApi,
  mockToast,
} from "src/components/ContactForm/ContactForm.po";
import {
  mockRecaptchaHandlers,
  mockRecaptchaToken,
  resetMockRecaptcha,
  setAttachRecaptchaRef,
} from "src/tests/mocks/mockGoogleRecaptcha";
import { screen, userEvent, waitFor } from "src/tests/test-utils";

describe("ContactForm", () => {
  let po: ContactFormPageObject;

  beforeEach(() => {
    po = new ContactFormPageObject();
    mockApi.sendEmail.contact.mockReset();
    mockApi.hubspot.leadGeneration.mockReset();
    mockToast.error.mockReset();
    resetMockRecaptcha();
  });

  const fillAndSubmit = async () => {
    const user = userEvent.setup();

    await po.fillAndSubmitContactForm(user);

    await waitFor(() => {
      expect(mockApi.sendEmail.contact).toHaveBeenCalled();
    });

    return user;
  };

  it("submits contact mail through the API layer without HubSpot on staging", async () => {
    po.setupMockSuccess();
    po.renderContactForm();

    await fillAndSubmit();

    await waitFor(() => {
      expect(mockApi.sendEmail.contact).toHaveBeenCalledWith({
        briefDescription: po.formData.briefDescription,
        companyName: po.formData.companyName,
        email: "ada@example.com",
        marketingConsent: true,
        name: po.formData.name,
        phone: po.formData.phone,
        recaptchaToken: mockRecaptchaToken,
      });
    });

    expect(mockApi.hubspot.leadGeneration).not.toHaveBeenCalled();
  });

  it("chains HubSpot after contact mail in production", async () => {
    const originalEnvironment = process.env.ENVIRONMENT;
    process.env.ENVIRONMENT = "production";

    try {
      po.setupMockSuccess();
      po.renderContactForm();

      await fillAndSubmit();

      await waitFor(() => {
        expect(mockApi.hubspot.leadGeneration).toHaveBeenCalled();
      });

      expect(
        mockApi.sendEmail.contact.mock.invocationCallOrder[0],
      ).toBeLessThan(
        mockApi.hubspot.leadGeneration.mock.invocationCallOrder[0],
      );
    } finally {
      process.env.ENVIRONMENT = originalEnvironment;
    }
  });

  it("shows the CMS success message after a successful submit", async () => {
    po.setupMockSuccess();
    po.renderContactForm();

    await fillAndSubmit();

    await waitFor(() => {
      expect(
        screen.getByText(
          defaultContactFormGlobalVariables.contactFormSuccessMessage ?? "",
        ),
      ).toBeInTheDocument();
    });

    expect(
      screen.queryByRole("button", { name: "Submit" }),
    ).not.toBeInTheDocument();
  });

  it("does not call the API when required fields fail validation", async () => {
    const user = userEvent.setup();

    po.renderContactForm();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(
      screen.getByText("You are missing some required fields!"),
    ).toBeInTheDocument();
    expect(mockApi.sendEmail.contact).not.toHaveBeenCalled();
    expect(mockApi.hubspot.leadGeneration).not.toHaveBeenCalled();
  });

  it("does not call the API when the email field is invalid", async () => {
    const user = userEvent.setup();

    po.renderContactForm();

    await user.type(
      screen.getByLabelText("Your full name *"),
      po.formData.name,
    );
    await user.type(screen.getByLabelText("Your email *"), "not-an-email");
    await user.tab();
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    expect(mockApi.sendEmail.contact).not.toHaveBeenCalled();
  });

  it("does not call the API when the honeypot field is filled", async () => {
    const user = userEvent.setup();

    po.setupMockSuccess();
    po.renderContactForm();

    await user.type(screen.getByLabelText("Website"), "https://spam.example");
    await po.fillAndSubmitContactForm(user);

    expect(mockApi.sendEmail.contact).not.toHaveBeenCalled();
    expect(mockApi.hubspot.leadGeneration).not.toHaveBeenCalled();
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it("submits marketingConsent false when the CMS checkbox is unchecked", async () => {
    const user = userEvent.setup();

    po.setupMockSuccess();
    po.renderContactForm({
      ...defaultContactFormGlobalVariables,
      contactFormMarketingConsentText: "Send me occasional updates",
    });

    await po.fillContactFormFields(user);
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockApi.sendEmail.contact).toHaveBeenCalledWith(
        expect.objectContaining({ marketingConsent: false }),
      );
    });
  });

  it("does not call HubSpot when the contact email request fails", async () => {
    po.setupMockEmailFailure();
    po.renderContactForm();

    await fillAndSubmit();

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Email failed");
    });

    expect(mockApi.hubspot.leadGeneration).not.toHaveBeenCalled();
  });

  it("shows an error when HubSpot lead generation fails", async () => {
    const originalEnvironment = process.env.ENVIRONMENT;
    process.env.ENVIRONMENT = "production";

    try {
      po.setupMockHubspotFailure();
      po.renderContactForm();

      await fillAndSubmit();

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith("HubSpot failed");
      });
    } finally {
      process.env.ENVIRONMENT = originalEnvironment;
    }
  });

  it("shows a toast when reCAPTCHA is not loaded", async () => {
    const user = userEvent.setup();

    setAttachRecaptchaRef(false);
    po.setupMockSuccess();
    po.renderContactForm();

    await po.fillAndSubmitContactForm(user);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "reCAPTCHA not loaded. Please refresh the page.",
      );
    });

    expect(mockApi.sendEmail.contact).not.toHaveBeenCalled();
  });

  it("shows a toast when reCAPTCHA verification returns no token", async () => {
    const user = userEvent.setup();

    (
      mockRecaptchaHandlers.executeAsync as jest.Mock<
        () => Promise<string | null>
      >
    ).mockImplementation(async () => null);

    po.setupMockSuccess();
    po.renderContactForm();

    await po.fillAndSubmitContactForm(user);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "reCAPTCHA verification failed. Please try again.",
      );
    });

    expect(mockApi.sendEmail.contact).not.toHaveBeenCalled();
  });
});

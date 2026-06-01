import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  ContactFormPageObject,
  mockApi,
} from "src/components/ContactForm/ContactForm.po";
import { mockRecaptchaToken } from "src/tests/mocks/mockGoogleRecaptcha";
import { screen, userEvent, waitFor } from "src/tests/test-utils";

describe("ContactForm", () => {
  let po: ContactFormPageObject;

  beforeEach(() => {
    po = new ContactFormPageObject();
    mockApi.sendEmail.contact.mockReset();
    mockApi.hubspot.leadGeneration.mockReset();
  });

  const fillAndSubmit = async () => {
    const user = userEvent.setup();

    await user.type(
      screen.getByLabelText("Your full name *"),
      po.formData.name,
    );
    await user.type(screen.getByLabelText("Your email *"), po.formData.email);
    await user.type(
      screen.getByLabelText("Your phone number"),
      po.formData.phone,
    );
    await user.type(
      screen.getByLabelText("Your company name"),
      po.formData.companyName,
    );
    await user.type(
      screen.getByLabelText("What can we help you with?"),
      po.formData.briefDescription,
    );
    await user.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockApi.sendEmail.contact).toHaveBeenCalled();
    });

    return user;
  };

  it("submits contact and HubSpot requests through the API layer", async () => {
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

    expect(mockApi.hubspot.leadGeneration).toHaveBeenCalledWith({
      briefDescription: po.formData.briefDescription,
      companyName: po.formData.companyName,
      email: "ada@example.com",
      marketingConsent: true,
      name: po.formData.name,
      phone: po.formData.phone,
    });
    expect(mockApi.sendEmail.contact.mock.invocationCallOrder[0]).toBeLessThan(
      mockApi.hubspot.leadGeneration.mock.invocationCallOrder[0],
    );
  });

  it("does not call HubSpot when the contact email request fails", async () => {
    po.setupMockEmailFailure();
    po.renderContactForm();

    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText("Email failed")).toBeInTheDocument();
    });

    expect(mockApi.hubspot.leadGeneration).not.toHaveBeenCalled();
  });

  it("shows an error when HubSpot lead generation fails", async () => {
    po.setupMockHubspotFailure();
    po.renderContactForm();

    await fillAndSubmit();

    await waitFor(() => {
      expect(screen.getByText("HubSpot failed")).toBeInTheDocument();
    });
  });
});

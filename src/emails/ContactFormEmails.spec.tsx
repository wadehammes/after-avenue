import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import { ContactFormConfirmationEmail } from "src/emails/ContactFormConfirmationEmail";
import { ContactFormSubmissionEmail } from "src/emails/ContactFormSubmissionEmail";

const emailProps = {
  companyName: "Acme Studio",
  email: "ada@example.com",
  hubspotPortalId: "12345",
  message: "We would love to collaborate on a new campaign.",
  name: "Ada Lovelace",
  phone: "555-555-5555",
};

describe("ContactFormEmails", () => {
  it("renders the internal submission email content", () => {
    render(<ContactFormSubmissionEmail {...emailProps} />);

    expect(screen.getByAltText("After Avenue")).toBeInTheDocument();
    expect(
      screen.getByText(/New message from Ada Lovelace/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Acme Studio")).toBeInTheDocument();
    expect(
      screen.getByText("We would love to collaborate on a new campaign."),
    ).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
  });

  it("renders the confirmation email content", () => {
    render(<ContactFormConfirmationEmail {...emailProps} />);

    expect(screen.getByAltText("After Avenue")).toBeInTheDocument();
    expect(screen.getByText(/Hi, Ada Lovelace/i)).toBeInTheDocument();
    expect(screen.getByText(/Acme Studio/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/hello@afteravenue.com/i).length,
    ).toBeGreaterThan(0);
  });
});

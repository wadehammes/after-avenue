import { beforeEach, describe, expect, it, jest } from "@jest/globals";

const emailProps = {
  companyName: "Acme Studio",
  email: "ada@example.com",
  hubspotPortalId: "12345",
  message: "We would love to collaborate on a new campaign.",
  name: "Ada Lovelace",
  phone: "555-555-5555",
};

const mockRender =
  jest.fn<
    (element: unknown, options?: { plainText?: boolean }) => Promise<string>
  >();

jest.mock("react-email", () => ({
  render: (element: unknown, options?: { plainText?: boolean }) =>
    mockRender(element, options),
}));

describe("renderContactEmails", () => {
  beforeEach(() => {
    mockRender.mockReset();
    mockRender.mockImplementation(async (_element, options) =>
      options?.plainText ? "plain Ada Lovelace" : "<html>Ada Lovelace</html>",
    );
  });

  it("renders the internal submission email", async () => {
    const { renderContactFormSubmissionEmail } = await import(
      "src/emails/renderContactEmails"
    );
    const result = await renderContactFormSubmissionEmail(emailProps);

    expect(mockRender).toHaveBeenCalledTimes(2);
    expect(mockRender.mock.calls[0]?.[1]).toBeUndefined();
    expect(mockRender.mock.calls[1]?.[1]).toEqual({ plainText: true });
    expect(result.html).toContain("Ada Lovelace");
    expect(result.text).toContain("Ada Lovelace");
  });

  it("renders the confirmation email", async () => {
    const { renderContactFormConfirmationEmail } = await import(
      "src/emails/renderContactEmails"
    );
    const result = await renderContactFormConfirmationEmail(emailProps);

    expect(mockRender).toHaveBeenCalledTimes(2);
    expect(mockRender.mock.calls[0]?.[1]).toBeUndefined();
    expect(mockRender.mock.calls[1]?.[1]).toEqual({ plainText: true });
    expect(result.html).toContain("Ada Lovelace");
    expect(result.text).toContain("Ada Lovelace");
  });
});

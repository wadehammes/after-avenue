import { describe, expect, it } from "@jest/globals";
import { Input } from "src/components/Input/Input.component";
import { render, screen } from "src/tests/test-utils";

describe("Input", () => {
  it("renders a labeled text field", () => {
    render(
      <Input label="Your email *" name="email" placeholder="you@example.com" />,
    );

    expect(screen.getByLabelText("Your email *")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("shows a field error message when provided", () => {
    render(
      <Input
        errorMessage="Enter a valid email address"
        hasError={{ message: "Enter a valid email address", type: "manual" }}
        label="Your email *"
        name="email"
      />,
    );

    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
  });
});

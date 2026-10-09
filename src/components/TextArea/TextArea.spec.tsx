import { describe, expect, it } from "@jest/globals";
import { TextArea } from "src/components/TextArea/TextArea.component";
import { render, screen } from "src/tests/test-utils";

describe("TextArea", () => {
  it("renders a labeled textarea", () => {
    render(
      <TextArea
        label="What can we help you with?"
        name="message"
        placeholder="Your message"
      />,
    );

    expect(
      screen.getByLabelText("What can we help you with?"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your message")).toBeInTheDocument();
  });
});

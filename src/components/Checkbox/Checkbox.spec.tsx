import { describe, expect, it } from "@jest/globals";
import { Checkbox } from "src/components/Checkbox/Checkbox.component";
import { render, screen } from "src/tests/test-utils";

describe("Checkbox", () => {
  it("renders a labeled checkbox", () => {
    render(<Checkbox checked={false} label="Send me updates" name="consent" />);

    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByText("Send me updates")).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it } from "@jest/globals";
import { StyledButtonPageObject } from "src/components/StyledButton/StyledButton.po";
import { screen } from "src/tests/test-utils";

describe("StyledButton", () => {
  let po: StyledButtonPageObject;

  beforeEach(() => {
    po = new StyledButtonPageObject();
  });

  it("renders the button label", () => {
    po.renderStyledButton("Get in touch");

    expect(screen.getByTestId(po.testId)).toHaveTextContent("Get in touch");
  });
});

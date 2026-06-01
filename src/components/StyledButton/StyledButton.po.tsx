import { StyledButton } from "src/components/StyledButton/StyledButton.component";
import {
  BasePageObject,
  type BasePageObjectProps,
} from "src/tests/basePageObject.po";
import { styledButtonFactory } from "src/tests/factories/StyledButton.factory";
import { render } from "src/tests/test-utils";

export class StyledButtonPageObject extends BasePageObject {
  public testId = "rhStyledButton";

  constructor(
    { debug, raiseOnFind }: BasePageObjectProps = {
      debug: false,
      raiseOnFind: false,
    },
  ) {
    super({ debug, raiseOnFind });

    jest.resetAllMocks();
  }

  renderStyledButton(label = styledButtonFactory.build().label) {
    render(<StyledButton data-testid={this.testId}>{label}</StyledButton>);
  }
}

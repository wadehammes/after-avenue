import { api } from "src/api/urls";
import { DeployButton } from "src/components/DeployButton/DeployButton.component";
import {
  BasePageObject,
  type BasePageObjectProps,
} from "src/tests/basePageObject.po";
import { mockApiResponse } from "src/tests/mocks/mockApiResponse";
import { render } from "src/tests/test-utils";

jest.mock("src/api/urls", () => ({
  api: {
    deploy: {
      triggerHook: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

export const mockApi = jest.mocked(api);
export const mockToast = jest.requireMock("sonner").toast as {
  success: jest.Mock;
  error: jest.Mock;
};

export class DeployButtonPageObject extends BasePageObject {
  public deployHook = "https://example.com/deploy-hook";
  public label = "Refresh staging";

  constructor(
    { debug, raiseOnFind }: BasePageObjectProps = {
      debug: false,
      raiseOnFind: false,
    },
  ) {
    super({ debug, raiseOnFind });
  }

  renderDeployButton() {
    render(<DeployButton deployHook={this.deployHook} label={this.label} />);
  }

  setupMockSuccess() {
    mockApiResponse(
      true,
      mockApi.deploy.triggerHook,
      undefined,
      new Error("Deploy failed with status 500"),
    );
  }

  setupMockFailure() {
    mockApiResponse(
      false,
      mockApi.deploy.triggerHook,
      undefined,
      new Error("Deploy failed with status 500"),
    );
  }
}

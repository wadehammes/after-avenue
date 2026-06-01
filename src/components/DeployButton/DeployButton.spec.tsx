import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  DeployButtonPageObject,
  mockApi,
  mockToast,
} from "src/components/DeployButton/DeployButton.po";
import { screen, userEvent, waitFor } from "src/tests/test-utils";

describe("DeployButton", () => {
  let po: DeployButtonPageObject;

  beforeEach(() => {
    po = new DeployButtonPageObject();
    mockToast.success.mockReset();
    mockToast.error.mockReset();
  });

  it("triggers the deploy hook when pressed", async () => {
    const user = userEvent.setup();

    po.setupMockSuccess();
    po.renderDeployButton();

    await user.click(screen.getByRole("button", { name: po.label }));

    await waitFor(() => {
      expect(mockApi.deploy.triggerHook).toHaveBeenCalledWith(po.deployHook);
    });
  });

  it("shows a success toast and disables the button after a successful deploy", async () => {
    const user = userEvent.setup();

    po.setupMockSuccess();
    po.renderDeployButton();

    await user.click(screen.getByRole("button", { name: po.label }));

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Refresh successfully triggered",
      );
    });

    expect(
      screen.getByRole("button", { name: "Refreshing (wait ~2min)" }),
    ).toBeDisabled();
  });

  it("shows an error toast when the deploy hook fails", async () => {
    const user = userEvent.setup();

    po.setupMockFailure();
    po.renderDeployButton();

    await user.click(screen.getByRole("button", { name: po.label }));

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Failed to refresh");
    });

    expect(screen.getByRole("button", { name: po.label })).toBeEnabled();
  });
});

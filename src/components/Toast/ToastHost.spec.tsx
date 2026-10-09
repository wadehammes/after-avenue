jest.unmock("src/lib/toast/appToast");

import { describe, expect, it } from "@jest/globals";
import { act } from "react";
import { ToastHost } from "src/components/Toast/ToastHost.component";
import { appToast } from "src/lib/toast/appToast";
import { render, screen, waitFor } from "src/tests/test-utils";

describe("ToastHost", () => {
  it("renders children and shows toast content from appToast", async () => {
    render(
      <ToastHost>
        <p>Page content</p>
      </ToastHost>,
    );

    expect(screen.getByText("Page content")).toBeInTheDocument();

    act(() => {
      appToast.success("Saved");
    });

    await waitFor(() => {
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });
});

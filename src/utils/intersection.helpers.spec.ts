import { describe, expect, it } from "@jest/globals";
import { isNearViewport } from "src/utils/intersection.helpers";

const mockRect = (top: number, bottom: number) => ({
  top,
  bottom,
  left: 0,
  right: 100,
  width: 100,
  height: bottom - top,
  x: 0,
  y: top,
  toJSON: () => ({}),
});

describe("isNearViewport", () => {
  it("returns true when the element intersects the expanded viewport", () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = () => mockRect(100, 200);

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    expect(isNearViewport(element, 150)).toBe(true);
  });

  it("returns false when the element is below the expanded viewport", () => {
    const element = document.createElement("div");
    element.getBoundingClientRect = () => mockRect(1200, 1300);

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    expect(isNearViewport(element, 150)).toBe(false);
  });
});

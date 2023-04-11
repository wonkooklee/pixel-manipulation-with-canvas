import { describe, expect, it } from "vitest";

import { findOpaqueBounds, padBounds } from "./bounds";

function imageOf(rows: string[]) {
  const height = rows.length;
  const width = rows[0].length;
  const data = new Uint8ClampedArray(width * height * 4);

  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      data[(y * width + x) * 4 + 3] = cell === "#" ? 255 : 0;
    });
  });

  return { data, width, height };
}

describe("findOpaqueBounds", () => {
  it("returns the inclusive box around opaque pixels", () => {
    const image = imageOf([
      "......",
      "..#...",
      ".#..#.",
      "......",
    ]);

    expect(findOpaqueBounds(image, 20)).toEqual({ top: 1, right: 4, bottom: 2, left: 1 });
  });

  it("ignores pixels at or below the alpha threshold", () => {
    const image = imageOf(["#.", ".."]);
    image.data[3] = 20;

    expect(findOpaqueBounds(image, 20)).toBeNull();
  });

  it("returns null for a fully transparent image", () => {
    expect(findOpaqueBounds(imageOf(["...", "..."]), 20)).toBeNull();
  });
});

describe("padBounds", () => {
  const size = { width: 400, height: 400 };

  it("expands every side by the padding", () => {
    expect(padBounds({ top: 59, right: 130, bottom: 174, left: 50 }, 5, size)).toEqual({
      top: 54,
      right: 135,
      bottom: 179,
      left: 45,
    });
  });

  it("keeps the padded box inside the image", () => {
    expect(padBounds({ top: 2, right: 397, bottom: 399, left: 0 }, 5, size)).toEqual({
      top: 0,
      right: 399,
      bottom: 399,
      left: 0,
    });
  });
});

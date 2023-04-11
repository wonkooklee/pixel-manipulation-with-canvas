import { describe, expect, it } from "vitest";

import { formatRatio, markPixelsByAlpha } from "./pixels";

const pixels = (...alphas: number[]) =>
  new Uint8ClampedArray(alphas.flatMap((alpha) => [0, 0, 0, alpha]));

describe("markPixelsByAlpha", () => {
  it("counts pixels above the threshold as foreground", () => {
    const data = pixels(0, 60, 61, 255);

    expect(markPixelsByAlpha(data, 60, 0, 4)).toEqual({ foreground: 2, background: 2 });
  });

  it("tints foreground and background pixels differently", () => {
    const data = pixels(255, 0);

    markPixelsByAlpha(data, 60, 0, 2);

    expect(Array.from(data)).toEqual([0, 120, 0, 200, 0, 240, 0, 255]);
  });

  it("only touches pixels within the given range", () => {
    const data = pixels(255, 255, 255);

    expect(markPixelsByAlpha(data, 60, 1, 2)).toEqual({ foreground: 1, background: 0 });
    expect(Array.from(data.subarray(0, 4))).toEqual([0, 0, 0, 255]);
    expect(Array.from(data.subarray(8))).toEqual([0, 0, 0, 255]);
  });
});

describe("formatRatio", () => {
  it("formats foreground over background as a percentage", () => {
    expect(formatRatio({ foreground: 11146, background: 148854 })).toBe("7.49 %");
  });

  it("avoids dividing by zero", () => {
    expect(formatRatio({ foreground: 3, background: 0 })).toBe("-");
  });
});

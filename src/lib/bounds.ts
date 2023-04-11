import { RGBA_CHANNELS } from "./pixels";

export interface Bounds {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const ALPHA = 3;

export function findOpaqueBounds(
  { data, width, height }: Pick<ImageData, "data" | "width" | "height">,
  alphaThreshold: number,
): Bounds | null {
  let top = height;
  let right = -1;
  let bottom = -1;
  let left = width;

  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * width * RGBA_CHANNELS;

    for (let x = 0; x < width; x += 1) {
      if (data[rowOffset + x * RGBA_CHANNELS + ALPHA] <= alphaThreshold) {
        continue;
      }

      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }

  return bottom === -1 ? null : { top, right, bottom, left };
}

export function padBounds({ top, right, bottom, left }: Bounds, padding: number): Bounds {
  return {
    top: top - padding,
    right: right + padding,
    bottom: bottom + padding,
    left: left - padding,
  };
}

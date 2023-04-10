export const RGBA_CHANNELS = 4;

const GREEN = 1;
const ALPHA = 3;

const FOREGROUND_MARK = { green: 120, alpha: 200 } as const;
const BACKGROUND_MARK = { green: 240, alpha: 255 } as const;

export interface AlphaTally {
  foreground: number;
  background: number;
}

export function markPixelsByAlpha(
  data: Uint8ClampedArray,
  threshold: number,
  start: number,
  end: number,
): AlphaTally {
  const tally: AlphaTally = { foreground: 0, background: 0 };

  for (let offset = start * RGBA_CHANNELS; offset < end * RGBA_CHANNELS; offset += RGBA_CHANNELS) {
    const mark = data[offset + ALPHA] > threshold ? FOREGROUND_MARK : BACKGROUND_MARK;

    data[offset + GREEN] = mark.green;
    data[offset + ALPHA] = mark.alpha;

    if (mark === FOREGROUND_MARK) {
      tally.foreground += 1;
    } else {
      tally.background += 1;
    }
  }

  return tally;
}

export function formatRatio({ foreground, background }: AlphaTally): string {
  if (background === 0) {
    return "-";
  }

  return `${((foreground / background) * 100).toFixed(2)} %`;
}

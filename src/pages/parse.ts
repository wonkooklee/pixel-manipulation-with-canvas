import "../styles/base.css";
import "../styles/parse.css";

import sampleUrl from "../assets/images/img.png";
import { createContext2D, loadImage, nextFrame } from "../lib/canvas";
import { getElement } from "../lib/dom";
import { type AlphaTally, formatRatio, markPixelsByAlpha } from "../lib/pixels";

const CANVAS_SIZE = 400;
const DEFAULT_THRESHOLD = 60;
const ROWS_PER_FRAME = 4;

const ui = {
  canvas: getElement("canvas", HTMLCanvasElement),
  processed: getElement("processed", HTMLOutputElement),
  total: getElement("total", HTMLOutputElement),
  foreground: getElement("foreground", HTMLOutputElement),
  background: getElement("background", HTMLOutputElement),
  ratio: getElement("ratio", HTMLOutputElement),
  threshold: getElement("threshold", HTMLInputElement),
  action: getElement("action", HTMLButtonElement),
};

const context = createContext2D(ui.canvas, CANVAS_SIZE, { willReadFrequently: true });

ui.threshold.value = String(DEFAULT_THRESHOLD);

loadImage(sampleUrl).then((image) => {
  context.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ui.action.disabled = false;
}, console.error);

ui.action.addEventListener("click", () => void parse(readThreshold()), { once: true });

function readThreshold(): number {
  const value = ui.threshold.valueAsNumber;

  return Number.isNaN(value) ? DEFAULT_THRESHOLD : Math.min(Math.max(value, 0), 255);
}

async function parse(threshold: number): Promise<void> {
  ui.action.disabled = true;
  ui.threshold.disabled = true;
  ui.action.textContent = "parsing...";

  const imageData = context.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const { width, height } = imageData;
  const tally: AlphaTally = { foreground: 0, background: 0 };
  const startedAt = performance.now();

  ui.total.value = String(width * height);

  for (let row = 0; row < height; row += ROWS_PER_FRAME) {
    await nextFrame();

    const rows = Math.min(ROWS_PER_FRAME, height - row);
    const marked = markPixelsByAlpha(imageData.data, threshold, row * width, (row + rows) * width);

    tally.foreground += marked.foreground;
    tally.background += marked.background;

    context.putImageData(imageData, 0, 0, 0, row, width, rows);
    renderProgress((row + rows) * width, tally);
  }

  console.info(`Parsed ${width * height} pixels in ${(performance.now() - startedAt).toFixed(1)} ms`);
  ui.action.textContent = "done";
}

function renderProgress(processed: number, tally: AlphaTally): void {
  ui.processed.value = String(processed);
  ui.foreground.value = String(tally.foreground);
  ui.background.value = String(tally.background);
  ui.ratio.value = formatRatio(tally);
}

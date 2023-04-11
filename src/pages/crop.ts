import "../styles/base.css";
import "../styles/crop.css";

import sample1Url from "../assets/images/crop-1.png";
import sample2Url from "../assets/images/crop-2.png";
import sample3Url from "../assets/images/crop-3.png";
import sample4Url from "../assets/images/crop-4.png";
import sample5Url from "../assets/images/crop-5.png";
import { type Bounds, findOpaqueBounds, padBounds } from "../lib/bounds";
import { createContext2D, loadImage } from "../lib/canvas";
import { getElement } from "../lib/dom";

const SAMPLES = [sample1Url, sample2Url, sample3Url, sample4Url, sample5Url];
const CANVAS_SIZE = 400;
const ALPHA_THRESHOLD = 20;
const PADDING = 5;
const GUIDE_COLOR = "#27bf22";

const ui = {
  canvas: getElement("canvas", HTMLCanvasElement),
  top: getElement("top", HTMLOutputElement),
  right: getElement("right", HTMLOutputElement),
  bottom: getElement("bottom", HTMLOutputElement),
  left: getElement("left", HTMLOutputElement),
  width: getElement("width", HTMLOutputElement),
  height: getElement("height", HTMLOutputElement),
  padding: getElement("padding", HTMLOutputElement),
  samples: getElement("samples", HTMLDivElement),
  action: getElement("action", HTMLButtonElement),
};

const context = createContext2D(ui.canvas, CANVAS_SIZE, { willReadFrequently: true });

let activeSample = 0;

ui.padding.value = String(PADDING);
ui.samples.replaceChildren(...SAMPLES.map((_, index) => createSampleTab(index)));

showSample(activeSample).catch(console.error);

ui.samples.addEventListener("click", ({ target }) => {
  const tab = target instanceof Element ? target.closest<HTMLButtonElement>("button[data-sample]") : null;
  const index = Number(tab?.dataset.sample);

  if (tab && index !== activeSample) {
    showSample(index).catch(console.error);
  }
});

ui.action.addEventListener("click", crop);

function createSampleTab(index: number): HTMLButtonElement {
  const tab = document.createElement("button");

  tab.type = "button";
  tab.dataset.sample = String(index);
  tab.textContent = String(index + 1);

  return tab;
}

async function showSample(index: number): Promise<void> {
  activeSample = index;

  for (const tab of ui.samples.querySelectorAll<HTMLButtonElement>("button[data-sample]")) {
    tab.setAttribute("aria-pressed", String(tab.dataset.sample === String(index)));
  }

  ui.action.disabled = true;
  ui.action.textContent = "crop";
  renderBounds(null);
  context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  const image = await loadImage(SAMPLES[index]);

  if (index !== activeSample) {
    return;
  }

  context.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ui.action.disabled = false;
}

function crop(): void {
  ui.action.disabled = true;

  const imageData = context.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const bounds = findOpaqueBounds(imageData, ALPHA_THRESHOLD);

  if (!bounds) {
    ui.action.textContent = "nothing to crop";
    return;
  }

  const padded = padBounds(bounds, PADDING);

  drawGuides(padded);
  renderBounds(padded);
  ui.action.textContent = "done";
}

function drawGuides({ top, right, bottom, left }: Bounds): void {
  context.strokeStyle = GUIDE_COLOR;

  strokeLine(0, top, CANVAS_SIZE, top);
  strokeLine(right, 0, right, CANVAS_SIZE);
  strokeLine(0, bottom, CANVAS_SIZE, bottom);
  strokeLine(left, 0, left, CANVAS_SIZE);
}

function strokeLine(fromX: number, fromY: number, toX: number, toY: number): void {
  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.stroke();
}

function renderBounds(bounds: Bounds | null): void {
  const { top, right, bottom, left } = bounds ?? { top: 0, right: 0, bottom: 0, left: 0 };

  ui.top.value = String(top);
  ui.right.value = String(right);
  ui.bottom.value = String(bottom);
  ui.left.value = String(left);
  ui.width.value = String(right - left);
  ui.height.value = String(bottom - top);
}

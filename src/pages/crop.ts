import "../styles/base.css";

import sampleUrl from "../assets/images/crop-1.png";
import { type Bounds, findOpaqueBounds, padBounds } from "../lib/bounds";
import { createContext2D, loadImage } from "../lib/canvas";
import { getElement } from "../lib/dom";

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
  action: getElement("action", HTMLButtonElement),
};

const context = createContext2D(ui.canvas, CANVAS_SIZE, { willReadFrequently: true });

ui.padding.value = String(PADDING);

loadImage(sampleUrl).then((image) => {
  context.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  ui.action.disabled = false;
}, console.error);

ui.action.addEventListener("click", crop);

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

function renderBounds({ top, right, bottom, left }: Bounds): void {

  ui.top.value = String(top);
  ui.right.value = String(right);
  ui.bottom.value = String(bottom);
  ui.left.value = String(left);
  ui.width.value = String(right - left);
  ui.height.value = String(bottom - top);
}

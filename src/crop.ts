(function ({ IDS }) {
  const $ = <T>(eleId: string) => <T>document.getElementById(eleId);

  const domEl = {
    bottom: <HTMLInputElement>$(IDS.BOTTOM),
    button: <HTMLButtonElement>$(IDS.BUTTON),
    canvas: <HTMLCanvasElement>$(IDS.CANVAS),
    height: <HTMLInputElement>$(IDS.HEIGHT),
    left: <HTMLInputElement>$(IDS.LEFT),
    offset: <HTMLInputElement>$(IDS.OFFSET),
    right: <HTMLInputElement>$(IDS.RIGHT),
    top: <HTMLInputElement>$(IDS.TOP),
    width: <HTMLInputElement>$(IDS.WIDTH),
  };

  let clicked = false;
  let offset = 10;

  const axisLength = 400;
  const ctx = domEl.canvas.getContext("2d", {
    alpha: true,
  });

  const img = new Image();
  img.src = "./assets/images/crop.png";
  img.onload = function () {
    ctx.drawImage(img, 0, 0, axisLength, axisLength);
    domEl.button.disabled = false;
  };

  domEl.canvas.width = axisLength;
  domEl.canvas.height = axisLength;

  updateTextNode(domEl.offset, offset);

  domEl.button.addEventListener("click", () => {
    if (clicked) return;

    clicked = true;
    domEl.button.disabled = true;

    const imageData = ctx.getImageData(0, 0, axisLength, axisLength);

    const { top, right, bottom, left } = getCroppingCoordinates(imageData.data);

    showCropLines({ top, right, bottom, left });

    updateTextNode(domEl.top, top);
    updateTextNode(domEl.right, right);
    updateTextNode(domEl.bottom, bottom);
    updateTextNode(domEl.left, left);
    updateTextNode(domEl.width, right - left);
    updateTextNode(domEl.height, bottom - top);

    updateTextNode(domEl.button, "done");
  });

  function getCroppingCoordinates(rgbaSequance: Uint8ClampedArray) {
    const vertical = [];
    const horizontal = [];

    for (let i = 0; i < rgbaSequance.length; i += 4) {
      if (rgbaSequance[i + 3] > 20) {
        vertical.push(Math.floor(Number(i / 4 / axisLength)));
        horizontal.push((i / 4) % axisLength);
      }
    }

    if (!vertical.length || !horizontal.length) {
      return null;
    }

    return {
      top: (vertical.shift() || 0) - offset,
      bottom: (vertical.pop() || 0) + offset,
      left: Math.min(...horizontal) - offset,
      right: Math.max(...horizontal) + offset,
    };
  }

  function showCropLines({
    top,
    right,
    bottom,
    left,
  }: {
    [key: string]: number;
  }) {
    ctx.strokeStyle = "#27bf22";

    drawOrthoLine({ direction: "vertical", value: top });
    drawOrthoLine({ direction: "horizontal", value: right });
    drawOrthoLine({ direction: "vertical", value: bottom });
    drawOrthoLine({ direction: "horizontal", value: left });
  }

  function drawOrthoLine({
    direction,
    value,
  }: {
    direction: "vertical" | "horizontal";
    value: number;
  }) {
    ctx.beginPath();
    if (direction === "vertical") {
      ctx.moveTo(0, value);
      ctx.lineTo(axisLength, value);
    } else {
      ctx.moveTo(value, 0);
      ctx.lineTo(value, axisLength);
    }
    ctx.stroke();
  }

  function updateTextNode(textNode: HTMLElement, content: number | string) {
    textNode.innerText =
      typeof content === "number" ? content.toString() : content;
  }
})({
  IDS: {
    BOTTOM: "bottom",
    BUTTON: "button",
    CANVAS: "canvas",
    HEIGHT: "height",
    LEFT: "left",
    OFFSET: "offset",
    RIGHT: "right",
    TOP: "top",
    WIDTH: "width",
  },
});

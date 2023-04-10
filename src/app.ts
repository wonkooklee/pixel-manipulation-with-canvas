(function ({ IDS }) {
  const $ = <T>(eleId: string) => <T>document.getElementById(eleId);

  const domEl = {
    black: <HTMLSpanElement>$(IDS.BLACK),
    button: <HTMLButtonElement>$(IDS.BUTTON),
    c: <HTMLSpanElement>$(IDS.C),
    canvas: <HTMLCanvasElement>$(IDS.CANVAS),
    ratio: <HTMLSpanElement>$(IDS.RATIO),
    t: <HTMLSpanElement>$(IDS.T),
    transparent: <HTMLSpanElement>$(IDS.TRANSPARENT),
    threshold: <HTMLInputElement>$(IDS.THRESHOLD),
  };

  let clicked = false;
  let threshold = 60;

  const ctx = domEl.canvas.getContext("2d", {
    alpha: true,
    willReadFrequently: true,
    desynchronized: true,
  });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  const img = new Image();
  const axisLength = 400;
  const browserDefaultTimeout = 4.7;

  img.src = "/src/assets/images/crop.png";
  img.onload = function () {
    ctx.drawImage(img, 0, 0, axisLength, axisLength);
    domEl.button.disabled = false;
  };

  domEl.canvas.width = axisLength;
  domEl.canvas.height = axisLength;
  domEl.threshold.value = threshold.toString();

  domEl.threshold.addEventListener("change", (changeEvent) => {
    threshold = Number((changeEvent.target as HTMLInputElement).value);
  });

  domEl.button.addEventListener("click", () => {
    if (clicked) return;

    clicked = true;

    domEl.button.innerText = "parsing...";
    domEl.button.disabled = true;
    domEl.threshold.disabled = true;

    const imageData = ctx.getImageData(0, 0, axisLength, axisLength);
    const rgbaSequance = imageData.data;
    let foreground = 0;
    let background = 0;

    const a = performance.now();

    for (let i = 3; i <= rgbaSequance.length; i += 4) {
      if (i === 3) {
        updateTextNode(domEl.t, (rgbaSequance.length / 4).toString());
      }

      new Promise((res) => {
        const schedulerId = setTimeout(() => {
          updateTextNode(domEl.c, ((i + 1) / 4).toString());

          if (rgbaSequance[i] > threshold) {
            updateTextNode(domEl.black, (++foreground).toString());
            rgbaSequance[i] = 200;
            rgbaSequance[i - 2] = 120;
          } else {
            updateTextNode(domEl.transparent, (++background).toString());
            rgbaSequance[i] = 255;
            rgbaSequance[i - 2] = 240;
          }

          updateTextNode(
            domEl.ratio,
            `${((foreground / background) * 100).toFixed(2).toString()} %`
          );

          ctx.putImageData(imageData, 0, 0);

          if (i + 1 === rgbaSequance.length) {
            // log time elapsed
            console.group("result");
            console.log("done");
            const b = performance.now();
            console.log("elapsed:", b - a);
            console.groupEnd();

            updateTextNode(domEl.button, "done");
          }

          res(clearTimeout(schedulerId));
        }, browserDefaultTimeout);
      });
    }
  });

  function updateTextNode(textNode: HTMLElement, content: string) {
    requestAnimationFrame(() => {
      textNode.innerText = content;
    });
  }
})({
  IDS: {
    BLACK: "black",
    BUTTON: "button",
    C: "c",
    CANVAS: "canvas",
    RATIO: "ratio",
    T: "t",
    TRANSPARENT: "transparent",
    THRESHOLD: "threshold",
  },
});

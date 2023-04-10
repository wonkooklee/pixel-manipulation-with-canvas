export function createContext2D(
  canvas: HTMLCanvasElement,
  size: number,
  settings?: CanvasRenderingContext2DSettings,
): CanvasRenderingContext2D {
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d", settings);

  if (!context) {
    throw new Error("CanvasRenderingContext2D is not supported in this environment");
  }

  return context;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);

  if (cached) {
    return cached;
  }

  const loading = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });

  imageCache.set(src, loading);
  loading.catch(() => imageCache.delete(src));

  return loading;
}

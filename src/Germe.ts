import Pixel from "./Pixel";

export default class Germe extends Pixel {
  public readonly pixels: Set<Pixel> = new Set();

  public constructor(pixel: Pixel) {
    super(pixel.image, pixel.x, pixel.y, pixel.rgb.r, pixel.rgb.g, pixel.rgb.b);
  }

  public removePixel(pixel: Pixel) {
    this.pixels.delete(pixel);
  }

  public addPixel(pixel: Pixel) {
    this.pixels.add(pixel);
  }

  public relocate(): boolean {
    const SEUIL_DEPLACEMENT = 5; // nb de pixels
  
    const oldX = this.x;
    const oldY = this.y;
  
    const {x, y} = this.kmeans();
  
    // Histoire du seuil   (distance euclidienne entre le germe avant et après déplacement < 10 pixels => on arrête)
    const deplacement = Math.sqrt(Math.pow((oldX - x), 2) + Math.pow((oldY - y), 2));
  
    this.set(this.image.pixel(x, y));
  
    return deplacement >= SEUIL_DEPLACEMENT;
  }
 

  private kmeans() {
    const pixels = [...this.pixels];
    let [x, y] = pixels.reduce((acc, pixel) => [acc[0] + pixel.x, acc[1] + pixel.y], [0, 0]);
    x /= pixels.length;
    y /= pixels.length;
    return {x: x, y: y};
  }

  private set(pixel: Pixel) {
    this.x = pixel.x;
    this.y = pixel.y;
    this.rgb = pixel.rgb;
    this.lab = pixel.lab;
  }
}

function equals(a: number, b: number) {
  return Math.abs(a - b) < 2;
}
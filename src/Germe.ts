import Pixel from "./Pixel";

export default class Germe extends Pixel {
  public readonly pixels: Pixel[] = [];

  public constructor(pixel: Pixel) {
    super(pixel.image, pixel.x, pixel.y, pixel.rgb.r, pixel.rgb.g, pixel.rgb.b);
  }

  public removePixel(pixel: Pixel) {
    const index = this.pixels.indexOf(pixel);
    if(index !== -1) {
      this.pixels.splice(index, 1);
    }
  }

  public addPixel(pixel: Pixel) {
    this.pixels.push(pixel);
  }

  public relocate(): boolean {
    const x1 = this.x;
    const y1 = this.y;

    const {x, y} = this.kmeans();
    this.set(this.image.pixel(x, y));

    if(!equals(x1, x) || !equals(y1, y)) {
      console.log(x1-x, y1-y);
    }

    return !equals(x1, x) || !equals(y1, y);
  }

  private kmeans() {
    let [x, y] = this.pixels.reduce((acc, pixel) => [acc[0] + pixel.x, acc[1] + pixel.y], [0, 0]);
    x /= this.pixels.length;
    y /= this.pixels.length;
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